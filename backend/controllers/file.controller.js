import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import s3 from "../config/aws-s3.js";

import {
  generateAESKey,
  encryptAESKey,
  decryptAESKey,
  encryptBuffer,
  decryptBuffer,
} from "../utils/crypto.util.js";

import {
  splitBufferIntoShards,
  mergeShardsIntoBuffer,
  recoverShards,
} from "../utils/shard.util.js";

import { streamToBuffer } from "../utils/stream.util.js";
import { autoRename, formatFiles } from "../utils/file.util.js";

import userModel from "../models/user.model.js";
import fileModel from "../models/file.model.js";

import {
  ALGORITHM,
  SHARD_COUNT,
  BUCKETS,
} from "../constants/storage.constant.js";

export const uploadController = async (request, response) => {
  try {
    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const user = request.user;

    // Check how many more files can fit the remaining storage
    let usedSpace = 0;
    const remainingStorage = user.storage.total - user.storage.used;
    const acceptedFiles = [];
    const rejectedFiles = [];

    for (const file of request.files) {
      if (usedSpace + file.size <= remainingStorage) {
        acceptedFiles.push(file);
        usedSpace += file.size;
      } else {
        rejectedFiles.push(file.originalname);
      }
    }

    // If no files can fit throw error
    if (acceptedFiles.length === 0) {
      return response.status(400).json({
        success: false,
        error: "Storage limit exceeded",
        rejected: rejectedFiles,
      });
    }

    // Else proceed to upload
    const uploadPromises = acceptedFiles.map(async (file) => {
      const aesKey = generateAESKey();

      const encryptedAESKey = encryptAESKey(aesKey);

      // Encrypt the file
      const { encryptedData, ivHex, authTagHex } = encryptBuffer(
        file.buffer,
        ALGORITHM,
        aesKey,
      );

      const shards = splitBufferIntoShards(encryptedData);
      const name = await autoRename(file.originalname, user._id);

      const payload = {
        name: name,
        size: file.size,
        mimetype: file.mimetype,
        encryptedSize: encryptedData.length,
        owner: user._id,
        encryption: {
          algorithm: ALGORITHM,
          ivHex: ivHex,
          authTagHex: authTagHex,
          encryptedAESKey: encryptedAESKey,
        },
        shardCount: SHARD_COUNT,
      };

      const newFile = new fileModel(payload);
      await newFile.save();

      // Upload each shard to a different bucket
      const shardUploads = shards.map((shard, index) => {
        const shardKey = `users/${newFile.owner}/${newFile._id}.shard-${index}`;

        const command = new PutObjectCommand({
          Bucket: BUCKETS[index],
          Key: shardKey,
          Body: shard,
          ContentType: file.mimetype,
        });

        return s3.send(command);
      });

      try {
        await Promise.all(shardUploads);
      } catch (err) {
        // Cleaup for orphan shards
        await Promise.all(
          shards.map((_, index) => {
            const shardKey = `users/${newFile.owner}/${newFile._id}.shard-${index}`;

            return s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKETS[index],
                Key: shardKey,
              }),
            );
          }),
        );
        await fileModel.findByIdAndDelete(newFile._id);
        throw err;
      }

      return {
        fileId: newFile._id,
        filename: newFile.name,
        size: newFile.size,
        mimetype: newFile.mimetype,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    user.storage.used += usedSpace;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      uploaded: uploadedFiles,
      rejected: rejectedFiles,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const downloadController = async (request, response) => {
  try {
    const user = request.user;
    const fileId = request.params.id;

    const file = await fileModel.findOne({
      _id: fileId,
      $or: [{ owner: user._id }, { sharedWith: user._id }],
    });

    if (!file) {
      return response.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    // Download all shards from different buckets
    const shardDownloads = BUCKETS.map((bucket, index) => {
      const shardKey = `users/${file.owner}/${file._id}.shard-${index}`;

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: shardKey,
      });

      return s3.send(command);
    });

    const shardResponses = await Promise.allSettled(shardDownloads);

    const shardBuffers = await Promise.all(
      shardResponses.map(async (res) => {
        if (res.status === "fulfilled") {
          return streamToBuffer(res.value.Body);
        }
        return null;
      }),
    );

    // Self-healing
    const shards = recoverShards(shardBuffers);
    const repairUploads = shardBuffers
      .map((shard, index) => {
        if (shard != null) return null; // No repair needed

        const shardKey = `users/${file.owner}/${file._id}.shard-${index}`;

        const command = new PutObjectCommand({
          Bucket: BUCKETS[index],
          Key: shardKey,
          Body: shards[index],
          ContentType: file.mimetype,
        });

        return s3.send(command);
      })
      .filter(Boolean);

    if (repairUploads.length > 0) {
      await Promise.all(repairUploads);
    }

    // Decrypt the file
    const [shardA, shardB, parity] = shards;
    const { algorithm, ivHex, authTagHex, encryptedAESKey } = file.encryption;
    const encryptedData = mergeShardsIntoBuffer([shardA, shardB]);
    const aesKey = decryptAESKey(encryptedAESKey);
    const decryptedBuffer = decryptBuffer(
      encryptedData,
      algorithm,
      aesKey,
      ivHex,
      authTagHex,
    );

    response.set({
      "Content-Type": file.mimetype || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.name}"`,
    });

    return response.send(decryptedBuffer);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const renameController = async (request, response) => {
  try {
    const { fileId, newName } = request.body;
    const user = request.user;

    if (!fileId) {
      return response.status(400).json({
        success: false,
        error: "fileId is required",
      });
    }

    const file = await fileModel.findById(fileId);

    if (!file || !file.owner.equals(user._id)) {
      return response.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    const name = await autoRename(newName, user._id);

    await fileModel.findOneAndUpdate(
      { _id: fileId, owner: user._id },
      { name: name },
    );

    return response.status(200).json({
      success: true,
      message: "Successfully updated the file's name",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const recycleController = async (request, response) => {
  try {
    const { fileIds } = request.body;
    const user = request.user;

    if (!fileIds) {
      return response.status(400).json({
        success: false,
        error: "fileIds are required",
      });
    }

    if (!Array.isArray(fileIds)) {
      return response.status(400).json({
        success: false,
        error: "fileIds must be an array",
      });
    }

    const result = await fileModel.updateMany(
      {
        _id: { $in: fileIds },
        owner: user._id,
        isRecycled: false,
      },
      {
        $set: {
          isRecycled: true,
        },
      },
    );

    let message = "All selected files are already in the recycle bin";

    if (result.modifiedCount == 1) {
      message = `Successfully moved ${result.modifiedCount} file to recycle bin`;
    } else if (result.modifiedCount > 1) {
      message = `Successfully moved ${result.modifiedCount} files to recycle bin`;
    }

    return response.status(200).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const restoreController = async (request, response) => {
  try {
    const { fileIds } = request.body;
    const user = request.user;

    if (!fileIds) {
      return response.status(400).json({
        success: false,
        error: "fileIds are required",
      });
    }

    if (!Array.isArray(fileIds)) {
      return response.status(400).json({
        success: false,
        error: "fileIds must be an array",
      });
    }

    const result = await fileModel.updateMany(
      {
        _id: { $in: fileIds },
        owner: user._id,
        isRecycled: true,
      },
      {
        $set: {
          isRecycled: false,
        },
      },
    );

    let message = "All selected files are already out of recycle bin";

    if (result.modifiedCount == 1) {
      message = `Successfully restored ${result.modifiedCount} file from recycle bin`;
    } else if (result.modifiedCount > 1) {
      message = `Successfully restored ${result.modifiedCount} files from recycle bin`;
    }

    return response.status(200).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const deleteController = async (request, response) => {
  try {
    const { fileIds } = request.body;
    const user = request.user;

    if (!fileIds) {
      return response.status(400).json({
        success: false,
        error: "fileIds are required",
      });
    }

    if (!Array.isArray(fileIds)) {
      return response.status(400).json({
        success: false,
        error: "fileIds must be an array",
      });
    }

    const files = await fileModel.find({
      _id: { $in: fileIds },
      owner: user._id,
    });

    if (files.length === 0) {
      return response.status(404).json({
        success: false,
        error: "No files found",
      });
    }

    const deleteFailures = [];

    // First delete the file shards from S3
    const fileDeletes = files.map(async (file) => {
      const shardDeletes = BUCKETS.map((bucket, index) => {
        const shardKey = `users/${file.owner}/${file._id}.shard-${index}`;

        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: shardKey,
        });

        return s3.send(command);
      });

      try {
        await Promise.all(shardDeletes);
      } catch (err) {
        console.log("S3 delete failed for file:", file._id);
        deleteFailures.push(file._id.toString());
      }
    });

    await Promise.all(fileDeletes);

    // Only delete from Mongo if S3 deletion succeeded
    const successfullyDeletedIds = files
      .map((file) => file._id.toString())
      .filter((id) => !deleteFailures.includes(id));

    await fileModel.deleteMany({
      _id: { $in: successfullyDeletedIds },
      owner: user._id,
    });

    const freedStorage = files.reduce((total, file) => {
      if (successfullyDeletedIds.includes(file._id.toString())) {
        return total + file.size;
      }
      return total;
    }, 0);

    if (freedStorage > 0) {
      user.storage.used = Math.max(0, user.storage.used - freedStorage);
      await user.save();
    }

    let message = "None of the selected files were deleted";

    if (successfullyDeletedIds.length === 1) {
      message = `Successfully deleted ${successfullyDeletedIds.length} file`;
    } else if (successfullyDeletedIds.length > 1) {
      message = `Successfully deleted ${successfullyDeletedIds.length} files`;
    }

    if (deleteFailures.length == 1) {
      if (successfullyDeletedIds.length > 0) {
        message += `, but failed to delete ${deleteFailures.length} file`;
      } else {
        message = `Failed to delete ${deleteFailures.length} file`;
      }
    } else if (deleteFailures.length > 1) {
      if (successfullyDeletedIds.length > 0) {
        message += `, but failed to delete ${deleteFailures.length} files`;
      } else {
        message = `Failed to delete ${deleteFailures.length} files`;
      }
    }

    return response.status(200).json({
      success: true,
      message: message,
      deleteFailures,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const myFilesController = async (request, response) => {
  try {
    const user = request.user;

    const files = await fileModel
      .find({ owner: user._id, isRecycled: false })
      .sort({ updatedAt: -1 })
      .select("_id name mimetype size updatedAt owner sharedWith isFavourite")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files, user._id),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const favouriteFilesController = async (request, response) => {
  try {
    const user = request.user;

    const files = await fileModel
      .find({ owner: user._id, isFavourite: true, isRecycled: false })
      .sort({ updatedAt: -1 })
      .select("_id name mimetype size updatedAt owner sharedWith isFavourite")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files, user._id),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const markFavController = async (request, response) => {
  try {
    const { fileId } = request.body;
    const user = request.user;

    if (!fileId) {
      return response.status(400).json({
        success: false,
        error: "fileId is required",
      });
    }

    const file = await fileModel.findById(fileId);

    if (!file || !file.owner.equals(user._id)) {
      return response.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    file.isFavourite = !file.isFavourite;
    await file.save();

    return response.status(200).json({
      success: true,
      message: "Successfully toggled file favourite status",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const shareFileController = async (request, response) => {
  try {
    const { fileId, email } = request.body;
    const user = request.user;

    if (!fileId || !email) {
      return response.status(400).json({
        success: false,
        error: "fileId and email are required",
      });
    }

    const file = await fileModel.findById(fileId);

    if (!file || !file.owner.equals(user._id)) {
      return response.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    const resipient = await userModel.findOne({ "email.value": email });

    if (!resipient) {
      return response.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await fileModel.findByIdAndUpdate(fileId, {
      $addToSet: { sharedWith: resipient._id },
    });

    return response.status(200).json({
      success: true,
      message: "Successfully shared the file",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const sharedFilesController = async (request, response) => {
  try {
    const user = request.user;

    const files = await fileModel
      .find({ sharedWith: user._id, isRecycled: false })
      .sort({ updatedAt: -1 })
      .select("_id name mimetype size updatedAt owner sharedWith isFavourite")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files, user._id),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const recycledFilesController = async (request, response) => {
  try {
    const user = request.user;

    const files = await fileModel
      .find({ owner: user._id, isRecycled: true })
      .sort({ updatedAt: -1 })
      .select("_id name mimetype size updatedAt owner sharedWith isFavourite")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files, user._id),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

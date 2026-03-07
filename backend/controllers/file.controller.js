import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import s3 from "../config/aws-s3.js";

import { encryptBuffer, decryptBuffer } from "../utils/crypto.util.js";

import {
  splitBufferIntoShards,
  mergeShardsIntoBuffer,
} from "../utils/shard.util.js";

import { streamToBuffer } from "../utils/stream.util.js";
import { autoRename, formatFiles } from "../utils/file.util.js";

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

    const uploadPromises = request.files.map(async (file) => {
      const { encryptedData, ivHex, authTagHex } = encryptBuffer(
        file.buffer,
        ALGORITHM,
      );
      const shards = splitBufferIntoShards(encryptedData, SHARD_COUNT);
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

    const totalUploadSize = request.files.reduce(
      (sum, file) => sum + file.size,
      0,
    );

    user.storage.used += totalUploadSize;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: uploadedFiles,
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

    const shardResponses = await Promise.all(shardDownloads);

    const shardBuffers = await Promise.all(
      shardResponses.map((res) => streamToBuffer(res.Body)),
    );
    const { algorithm, ivHex, authTagHex } = file.encryption;
    const encryptedBuffer = mergeShardsIntoBuffer(
      shardBuffers,
      file.shardCount,
    );
    const decryptedBuffer = decryptBuffer(
      encryptedBuffer,
      algorithm,
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
    const { fileId } = request.body;
    const user = request.user;

    if (!fileId) {
      return response.status(400).json({
        success: false,
        error: "fileId is required",
      });
    }

    const name = await autoRename(file.originalname, user._id);

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
      .select("_id name mimetype size updatedAt owner sharedWith")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const favoriteFilesController = async (request, response) => {
  try {
    const user = request.user;

    const files = await fileModel
      .find({ owner: user._id, isFavorite: true, isRecycled: false })
      .sort({ updatedAt: -1 })
      .select("_id name mimetype size updatedAt owner sharedWith")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files),
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
      .select("_id name mimetype size updatedAt owner sharedWith")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files),
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
      .select("_id name mimetype size updatedAt owner sharedWith")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    return response.status(200).json({
      success: true,
      message: "Successfully retrived the files",
      files: formatFiles(files),
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

import fileModel from "../models/file.model.js";

import { BUCKET_COUNT } from "../constants/storage.constant.js";
import { MIME_CATEGORY_MAP } from "../constants/memiCategory.contant.js";

import { formatFiles } from "../utils/file.util.js";

export const dataController = async (request, response) => {
  try {
    const user = request.user;

    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email.value,
      storage: user.storage,
    };

    const files = await fileModel
      .find({
        $or: [{ owner: user._id }, { sharedWith: user._id }],
        isRecycled: false,
      })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("_id name mimetype size updatedAt owner sharedWith isFavourite")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    const stats = await fileModel.aggregate([
      {
        $match: {
          owner: user._id,
          isRecycled: false,
        },
      },
      {
        $facet: {
          totalFiles: [
            { $count: "count" },
            { $addFields: { count: { $ifNull: ["$count", 0] } } },
          ],

          totalShards: [
            {
              $group: {
                _id: null,
                count: { $sum: "$shardCount" },
              },
            },
            { $project: { _id: 0, count: { $ifNull: ["$count", 0] } } },
          ],

          mimeTypeStats: [
            {
              $group: {
                _id: "$mimetype",
                count: { $sum: 1 },
                size: { $sum: "$size" },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
                size: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalFiles: {
            $ifNull: [{ $arrayElemAt: ["$totalFiles.count", 0] }, 0],
          },
          totalShards: {
            $ifNull: [{ $arrayElemAt: ["$totalShards.count", 0] }, 0],
          },
          mimeTypeStats: 1,
        },
      },
    ]);

    const recycleStats = await fileModel.aggregate([
      {
        $match: {
          owner: user._id,
          isRecycled: true,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          size: { $sum: "$size" },
        },
      },
    ]);

    const typeStats = {};

    stats[0].mimeTypeStats.forEach((m) => {
      const category = MIME_CATEGORY_MAP[m.type] || "Other Files";

      if (!typeStats[category]) {
        typeStats[category] = {
          count: 0,
          size: 0,
        };
      }

      typeStats[category].count += m.count;
      typeStats[category].size += m.size;
    });

    typeStats["Recycle Bin"] = {
      count: recycleStats[0]?.count || 0,
      size: recycleStats[0]?.size || 0,
    };

    const formattedStats = {
      totalFiles: stats[0].totalFiles,
      encryptedFiles: stats[0].totalFiles,
      totalShards: stats[0].totalShards,
      typeStats: typeStats,
      cloudBuckets: BUCKET_COUNT,
    };

    return response.status(200).json({
      success: true,
      message: "Successfully retrieved dashboard data",
      user: formattedUser,
      files: formatFiles(files, user._id),
      stats: formattedStats,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

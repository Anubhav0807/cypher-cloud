import fileModel from "../models/file.model.js";

import { BUCKET_COUNT } from "../constants/storage.constant.js";
import { MIME_CATEGORY_MAP } from "../constants/memiCategory.contant.js";

export const dataController = async (request, response) => {
  try {
    const user = request.user;

    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email.value,
      storage: user,
    };

    const files = await fileModel
      .find({ $or: [{ owner: user._id }, { sharedWith: user._id }] })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("_id name mimetype size updatedAt owner sharedWith")
      .populate("owner", "name")
      .populate("sharedWith", "name")
      .lean();

    const formattedFiles = files.map((file) => {
      return {
        id: file._id,
        name: file.name,
        type: file.mimetype,
        size: file.size,
        modified: file.updatedAt,
        members: [file.owner.name, ...file.sharedWith.map((user) => user.name)],
      };
    });

    const stats = await fileModel.aggregate([
      {
        $match: {
          $or: [{ owner: user._id }, { sharedWith: user._id }],
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
      files: formattedFiles,
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

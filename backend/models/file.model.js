import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    encryptedSize: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    sharedWith: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    encryption: {
      type: {
        algorithm: {
          type: String,
          required: true,
        },
        ivHex: {
          type: String,
          required: true,
        },
        authTagHex: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    shardCount: {
      type: Number,
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    isRecycled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// "My Files" API becomes very fast with this index
fileSchema.index({ owner: 1, createdAt: -1 });

const fileModel = mongoose.model("File", fileSchema);

export default fileModel;

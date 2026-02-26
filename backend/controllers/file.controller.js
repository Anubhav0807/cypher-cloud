import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/aws-s3.js";

export const uploadController = async (request, response) => {
  try {
    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const uploadPromises = request.files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_A_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      const fileUrl = `https://${process.env.S3_BUCKET_A_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`;
      console.log(fileUrl);

      return {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return response.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: uploadedFiles,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

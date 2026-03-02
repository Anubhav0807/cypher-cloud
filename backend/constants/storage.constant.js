export const ALGORITHM = "aes-256-gcm";

export const SHARD_COUNT = 3;

export const BUCKETS = [
  process.env.S3_BUCKET_A_NAME,
  process.env.S3_BUCKET_B_NAME,
  process.env.S3_BUCKET_C_NAME,
];

export const BUCKET_COUNT = BUCKETS.length;

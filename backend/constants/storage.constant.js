export const ALGORITHM = "aes-256-gcm";

export const DATA_SHARDS = 2;
export const PARITY_SHARDS = 1;
export const SHARD_COUNT = DATA_SHARDS + PARITY_SHARDS;

export const BUCKETS = [
  process.env.S3_BUCKET_A_NAME,
  process.env.S3_BUCKET_B_NAME,
  process.env.S3_BUCKET_C_NAME,
];

export const BUCKET_COUNT = BUCKETS.length;

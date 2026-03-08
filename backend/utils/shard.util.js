import { DATA_SHARDS, SHARD_COUNT } from "../constants/storage.constant.js";

export const splitBufferIntoShards = (buffer) => {
  const mid = Math.ceil(buffer.length / 2);

  let shardA = buffer.subarray(0, mid);
  let shardB = buffer.subarray(mid);

  // Make sure both shards are of equal length
  if (shardB.length < shardA.length) {
    const padded = Buffer.alloc(shardA.length);
    shardB.copy(padded);
    shardB = padded;
  }

  let parity = xorBuffers(shardA, shardB);

  return [shardA, shardB, parity];
};

export const mergeShardsIntoBuffer = (shards) => {
  if (!Array.isArray(shards) || shards.length !== DATA_SHARDS) {
    throw new Error(`Exactly ${DATA_SHARDS} shards are required`);
  }

  return Buffer.concat(shards);
};

export const recoverShards = (shards) => {
  if (!Array.isArray(shards) || shards.length !== SHARD_COUNT) {
    throw new Error(`Exactly ${SHARD_COUNT} shards are required`);
  }

  let [shardA, shardB, parity] = shards;

  if (shards.filter((shard) => shard == null).length > 1) {
    throw new Error("File cannot be reconstructed, too many shards missing");
  }

  // Reconstruct missing shard using XOR parity
  if (!shardA && shardB && parity) {
    shardA = xorBuffers(shardB, parity);
  }

  if (shardA && !shardB && parity) {
    shardB = xorBuffers(shardA, parity);
  }

  if (shardA && shardB && !parity) {
    parity = xorBuffers(shardA, shardB);
  }

  return [shardA, shardB, parity];
};

export const xorBuffers = (buf1, buf2) => {
  const length = Math.max(buf1.length, buf2.length);

  const result = Buffer.alloc(length);

  for (let i = 0; i < length; i++) {
    const a = buf1[i] || 0;
    const b = buf2[i] || 0;

    result[i] = a ^ b;
  }

  return result;
};

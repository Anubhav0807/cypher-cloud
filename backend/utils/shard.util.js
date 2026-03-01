export const splitBufferIntoShards = (buffer, shardCount) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Input must be a Buffer");
  }

  const shardSize = Math.ceil(buffer.length / shardCount);
  const shards = [];

  for (let i = 0; i < shardCount; i++) {
    const start = i * shardSize;
    const end = start + shardSize;

    shards.push(buffer.subarray(start, end));
  }

  return shards;
};

export const mergeShardsIntoBuffer = (shards, shardCount) => {
  if (!Array.isArray(shards) || shards.length !== shardCount) {
    throw new Error(`Exactly ${shardCount} shards are required`);
  }

  return Buffer.concat(shards);
};
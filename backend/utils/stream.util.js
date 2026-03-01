export const streamToBuffer = async (stream) => {
  return await new Promise((resolve, reject) => {
    const chunks = [];

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.once("end", () => resolve(Buffer.concat(chunks)));
    stream.once("error", reject);
  });
};

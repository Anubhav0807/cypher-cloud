import crypto from "crypto";

const key = Buffer.from(process.env.FILE_ENCRYPTION_KEY, "hex");

if (key.length !== 32) {
  throw new Error("Encryption key must be 32 bytes");
}

export const encryptBuffer = (buffer, algorithm) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    ivHex: iv.toString("hex"),
    authTagHex: authTag.toString("hex"),
  };
};

export const decryptBuffer = (encryptedBuffer, algorithm, ivHex, authTagHex) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted;
};

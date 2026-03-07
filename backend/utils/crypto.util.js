import fs from "fs";
import crypto from "crypto";

let PUBLIC_KEY;
let PRIVATE_KEY;

try {
  // Local development
  PUBLIC_KEY = fs.readFileSync("./keys/public.pem");
  PRIVATE_KEY = fs.readFileSync("./keys/private.pem");
} catch {
  // Render production
  PUBLIC_KEY = fs.readFileSync("/etc/secrets/public.pem");
  PRIVATE_KEY = fs.readFileSync("/etc/secrets/private.pem");
}

export const generateAESKey = () => {
  return crypto.randomBytes(32); // 256-bit AES key
};

export const encryptAESKey = (aesKey) => {
  const encryptedKey = crypto.publicEncrypt(PUBLIC_KEY, aesKey);

  return encryptedKey.toString("base64");
};

export const decryptAESKey = (encryptedKey) => {
  const decryptedKey = crypto.privateDecrypt(
    PRIVATE_KEY,
    Buffer.from(encryptedKey, "base64"),
  );

  return decryptedKey;
};

export const encryptBuffer = (buffer, algorithm, aesKey) => {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, aesKey, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    ivHex: iv.toString("hex"),
    authTagHex: authTag.toString("hex"),
  };
};

export const decryptBuffer = (
  encryptedBuffer,
  algorithm,
  aesKey,
  ivHex,
  authTagHex,
) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    aesKey,
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted;
};

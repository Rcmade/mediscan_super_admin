// import "server-only";

import crypto, { timingSafeEqual } from "crypto";

export const generateSHA1 = (data: unknown) => {
  const dataString = JSON.stringify(data);
  const hash = crypto.createHash("sha1");
  hash.update(dataString);
  return hash.digest("hex");
};


export function isValidSecret(secret: string) {
  const API_SECRET = process.env.REVISIT_SCHEDULE_API_SECRET;
  if (!API_SECRET) {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    console.error("Error comparing secrets:", error);
    return false;
  }
}

const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update(process.env.CRYPTO_HASH_SECRET!).digest(); // 32 bytes
const iv = crypto.randomBytes(16); // Initialization vector

export function encrypt(
  data: Record<string, string> | Record<string, string>[],
): string {
  const jsonData = JSON.stringify(data);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(jsonData, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); // Join IV and encrypted data
}

export function decrypt(encryptedData: string) {
  const [ivHex, encryptedHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf8"));
}

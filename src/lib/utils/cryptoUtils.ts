import crypto, { timingSafeEqual } from "crypto";

export const generateSHA1 = (data: unknown) => {
  const dataString = JSON.stringify(data);
  const hash = crypto.createHash("sha1");
  hash.update(dataString);
  return hash.digest("hex");
};

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
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

import crypto, { timingSafeEqual } from "crypto";

export function verifyRazorpaySignature(data: unknown, signature: string) {
  const dataString = JSON.stringify(data);

  // Generate the HMAC SHA256 hash
  const expected_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
    .update(dataString)
    .digest("hex");

  const isValidSignature = timingSafeEqual(
    Buffer.from(expected_signature),
    Buffer.from(signature),
  );

  return isValidSignature;
}

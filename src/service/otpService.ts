import crypto from "crypto";

class OTPService {
  public static createOtp() {
    const otp = crypto.randomInt(100000, 999999);
    return otp;
  }
  public static verifyOtp(hashedString: string, data: string) {
    const [hash, expires] = hashedString.split("|");
    if (!hash || !expires) {
      return false; // Invalid format
    }

    const dataWithExpiry = `${data}|${expires}`;
    const newHash = crypto
      .createHmac("sha256", process.env.HASH_SECRET as string)
      .update(dataWithExpiry)
      .digest("hex");

    if (newHash !== hash) {
      return false; // Hashes do not match
    }

    if (new Date() > new Date(expires)) {
      return false; // OTP has expired
    }

    return true; // OTP is valid
  }
}

export default OTPService;

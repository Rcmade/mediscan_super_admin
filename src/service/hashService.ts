import { getExpireTime } from "@/lib/utils/dateUtils";
import crypto from "crypto";
class HashService {
  public static hashOtp(data: string) {
    const expires = String(getExpireTime().toISOString());
    const dataWithExpiry = `${data}|${expires}`;
    const hash = crypto
      .createHmac("sha256", process.env.HASH_SECRET as string)
      .update(dataWithExpiry)
      .digest("hex");

    // Embed the expiration time in the hash string
    return `${hash}|${expires}`;
  }
}
export default HashService;

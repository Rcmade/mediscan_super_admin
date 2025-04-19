// import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
// import { generateSignature, getCloudinaryId } from "@/lib/utils/cloudinaryUtils";
// import { generateSHA1 } from "@/lib/utils/cryptoUtils";

/**
 * Service class for interacting with Cloudinary.
 */
export class CloudinaryService {
  /**
   * Signs the upload request with Cloudinary API secret.
   * @param {Record<string, string>} paramsToSign - Parameters to be signed.
   * @returns {string} - The signature of the signed request.
   */
  async signUploadRequest(paramsToSign: Record<string, string>) {
    // Sign the request using Cloudinary API secret
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return signature;
  }

  // async deleteCloudinaryPdf(pdfUrl: string) {
  //   const publicFileId = getCloudinaryId(pdfUrl || "");
  //   if (publicFileId) {
  //     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  //     const timestamp = new Date().getTime();
  //     const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "";
  //     const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  //     const signature = generateSHA1(
  //       generateSignature(publicFileId, apiSecret),
  //     );
  //     const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/destroy`;
  //     const { data } = await axios.post(url, {
  //       public_id: publicFileId,
  //       signature: signature,
  //       api_key: apiKey,
  //       timestamp: timestamp,
  //     });
  //     return data;
  //   }
  // }
}

// Create an instance of the CloudinaryService
const cloudinaryService = new CloudinaryService();

// Export the CloudinaryService instance
export default cloudinaryService;

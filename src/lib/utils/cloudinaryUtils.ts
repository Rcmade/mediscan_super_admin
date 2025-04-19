import { CLOUDINARY_REGEX, CLOUDINARY_UPLOAD_URL } from "@/constant";
import { SignatureReturnT } from "@/types";
import axios from "axios";
import { client } from "../rpc";
import imageCompression from "browser-image-compression";

export const getCloudinaryId = (link: string) => {
  if (!link) return null;
  if (link.startsWith("blob")) return null;
  const parts = CLOUDINARY_REGEX.exec(link);
  return parts && parts.length > 2 ? parts[parts.length - 2] : link;
};

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};


export const uploadToCloudinary = async (
  fileInfo: SignatureReturnT & { img?: string | File },
): Promise<string> => {
  if (typeof fileInfo.img === "string" && getCloudinaryId(fileInfo.img)) {
    return fileInfo.img; // Return the existing Cloudinary URL
  }

  if (!(fileInfo.img instanceof File)) {
    throw new Error("Invalid file format");
  }

  let file = fileInfo.img;

  try {
    // Compression options
    const options = {
      maxSizeMB: 1, // Maximum file size (in MB)
      maxWidthOrHeight: 500, // Max width or height
      useWebWorker: true, // Enable web worker for faster processing
    };

    const compressedFile = await imageCompression(file, options);

    file = compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
  }

  const formData = new FormData();
  formData.append("file", fileInfo.img);
  formData.append("upload_preset", fileInfo.upload_preset);
  formData.append("source", fileInfo.source);
  formData.append("signature", fileInfo.signature);
  formData.append("timestamp", String(fileInfo.timestamp));
  formData.append(
    "api_key",
    String(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY),
  );

  const { data } = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.secure_url as string;
};

// export const formateDeleteCldResources = (data: GetExpiredTempOrderT) => {
//   const cloudinaryPublicIds: { [key: string]: string } = {};

//   // Iterate over the data and populate the cloudinaryPublicIds object
//   data.forEach((order) => {
//     const orderId = order.id;
//     order.orderItems.forEach((item) => {
//       const cloudinaryId = getCloudinaryId(item.product);
//       if (cloudinaryId) cloudinaryPublicIds[cloudinaryId] = orderId;
//     });
//   });

//   return cloudinaryPublicIds;
// };

export const getSignature = async (): Promise<SignatureReturnT> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const source = "uw";

  const res = await client.api.main.uploads.signature.$post({
    json: { timestamp: String(timestamp), upload_preset, source },
  });

  const data = await res.json();
  if ("message" in data) {
    throw new Error(data.message);
  }

  return {
    timestamp,
    upload_preset,
    source,
    signature: data.signature,
  };
};

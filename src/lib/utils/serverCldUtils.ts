import cloudinary from "@/config/cloudinaryConfig";

export const deleteCldResources = async (ids: string[]) => {
  const res = await cloudinary.v2.api.delete_resources(ids, {
    type: "upload",
    resource_type: "image",
  });
  return res;
};

import cloudinaryService from "@/service/uploadService";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const uploads = new Hono().post(
  "/signature",
  zValidator(
    "json",
    z.object({
      timestamp: z.string(),
      upload_preset: z.string(),
      source: z.string(),
    }),
  ),

  async (c) => {
    const paramsToSign = c.req.valid("json");

    if (
      !paramsToSign.source ||
      !paramsToSign.upload_preset ||
      !paramsToSign.upload_preset
    ) {
      return c.json(
        {
          message: "No files received.",
        },
        400,
      );
    }
    const signature = await cloudinaryService.signUploadRequest(paramsToSign);
    return c.json({ signature });
  },
);

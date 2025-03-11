import { userRoleLimitedAccess } from "@/constant";
import { signUpSchema } from "./authSchema";
import { z } from "zod";

export const createOrgUser = signUpSchema.merge(
  z.object({
    role: z.enum(userRoleLimitedAccess),
  }),
);

export type OrgUserValues = z.infer<typeof createOrgUser>;

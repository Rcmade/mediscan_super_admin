import { userRoleLimitedAccess } from "@/constant";
import { signUpSchema } from "./authSchema";
import { z } from "zod";

export const createOrgUser = signUpSchema.merge(
  z.object({
    role: z.enum(userRoleLimitedAccess),
    userOrgId: z.string().optional(),
  }),
);

export type OrgUserValues = z.infer<typeof createOrgUser>;

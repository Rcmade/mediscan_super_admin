import { z } from "zod";
import { phoneSchema } from ".";
import {
  businessTypeArr,
  countryArr,
  gstRegex,
  orgBusinessCategoryArr,
  panRegex,
} from "@/constant";
// import { orgTransactionSchema } from "./transactionSchema";

export const createOrgSchema = z.object({
  doctorName: z.string().nonempty(),
  email: z.string().email().nonempty(),
  // Work as business legal name
  doctorWebName: z.string().nonempty().min(4).max(200),
  serviceStartDate: z.coerce.date(),
  serviceEndDate: z.coerce.date(),
  userLimit: z.coerce.number().min(1).int(),
  phone: phoneSchema,
  enabled: z.boolean().default(false),
  businessType: z.enum(businessTypeArr),
});

export const createOrgSchemaWithRefine = createOrgSchema.refine(
  (data) => data.serviceEndDate >= data.serviceStartDate,
  {
    message: "End date must be after or equal to start date.",
    path: ["serviceEndDate"],
  },
);

export type OrgFormValues = z.infer<typeof createOrgSchema>;

export const createOrgBusinessProfile = z.object({
  category: z.enum(orgBusinessCategoryArr),
  address: z.object({
    street1: z.string().max(100).optional(),
    street2: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    state: z.string().min(2).max(32).optional(),
    postalCode: z.string().length(6).optional(),
    country: z.enum(countryArr).optional(),
  }),

  legalInfo: z.object({
    pan: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .refine(
        (val) => val === undefined || panRegex.test(val),
        "Invalid PAN format. Should be a 10-character alphanumeric string like AVOJB1111K, with 4th character one of CHFABTJGEL.",
      )
      .optional(),

    gst: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .refine(
        (val) => val === undefined || gstRegex.test(val),
        "Invalid GSTIN format. Should be a 15-character alphanumeric string.",
      )
      .optional(),
  }),
});

export type BusinessProfileFormValues = z.infer<
  typeof createOrgBusinessProfile
>;

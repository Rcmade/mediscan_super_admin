import { z } from "zod";
import { phoneSchema } from ".";
import { orgTransactionSchema } from "./transactionSchema";

export const createOrgSchema = z.object({
  doctorName: z.string().nonempty(""),
  doctorWebName: z.string().nonempty(),
  serviceStartDate: z.coerce.date(),
  serviceEndDate: z.coerce.date(),
  userLimit: z.coerce.number().min(1).int(),
  phone: phoneSchema,
  transaction: orgTransactionSchema,
});
// .merge();

export const createOrgSchemaWithRefine = createOrgSchema.refine(
  (data) => data.serviceEndDate >= data.serviceStartDate,
  {
    message: "End date must be after or equal to start date.",
    path: ["serviceEndDate"],
  },
);

export type OrgFormValues = z.infer<typeof createOrgSchema>;

import { z } from "zod";

export const appointmentReasonsTypeSchema = z.object({
  // orgWebName: z.string().min(1),
  name: z.string().min(1).max(20),
  amount: z
    .number()
    .min(0, { message: "Amount must be greater than or equal to 0" })
    .max(1000000, { message: "Amount must be less than or equal to 1000000" }),
  appointmentReasonsTypeId: z.string().optional(),
});


export type AppointmentReasonsTypeSchemaT = z.infer<
  typeof appointmentReasonsTypeSchema
>;
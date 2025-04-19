import { APPOINTMENT_ID_HASH_NAME, paymentMethodsArr } from "@/constant";
import { z } from "zod";

export const appointmentPaymentInitiateSchema = z.object({
  [APPOINTMENT_ID_HASH_NAME]: z.string().min(1),
  paymentMethods: z.enum(paymentMethodsArr),
});

export const appointmentPaymentConfirmSchema = z.object({
  payment: z.object({
    id: z.string().min(1),
  }),
  // user: z.object({
  //   id: z.string().min(1),
  // }),
  organization: z.object({
    id: z.string().min(1),
  }),
});

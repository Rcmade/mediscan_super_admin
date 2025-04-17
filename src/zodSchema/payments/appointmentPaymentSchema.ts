import { APPOINTMENT_ID_HASH_NAME, paymentMethodsArr } from "@/constant";
import { z } from "zod";

export const appointmentPaymentInitiateSchema = z.object({
  [APPOINTMENT_ID_HASH_NAME]: z.string().min(1),
  paymentMethods: z.enum(paymentMethodsArr),
});

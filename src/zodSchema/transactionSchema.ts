import { z } from "zod";

export const orgTransactionSchema = z.object({
  total: z.number().nonnegative(),
  paid: z.number().nonnegative(),
  due: z.number().nonnegative(),
  orgWebName: z.string().optional(),
  transactionId: z.string().optional(),
});

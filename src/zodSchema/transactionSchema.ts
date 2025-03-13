import { z } from "zod";

export const orgTransactionSchema = z.object({
  total: z.number().nonnegative().default(0),
  paid: z.number().nonnegative().default(0),
  due: z.number().nonnegative().default(0),
  orgWebName: z.string().optional(),
  transactionId: z.string().optional(),
});

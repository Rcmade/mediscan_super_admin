import { z } from "zod";

export const orgTransactionSchema = z.object({
  total: z.number().nonnegative().min(1).default(0),
  paid: z.number().nonnegative().default(0),
  due: z.number().nonnegative().default(0),
  orgWebName: z.string(),
  transactionId: z.string().optional(),
});

export type OrgTransactionSchema = z.infer<typeof orgTransactionSchema>;

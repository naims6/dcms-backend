import { PaymentPurpose } from "../../generated/prisma/enums.js";
import { z } from "zod";

export const InitiatePaymentSchema = z.object({
  amount: z.number(),
  studentId: z.string(),
  purpose: z.enum(PaymentPurpose),
});

export type IInitiatePayment = z.infer<typeof InitiatePaymentSchema>;

export interface SSLPaymentCallback {
  status: string;
  tran_id: string;
  val_id: string;
  amount: string;
  card_type: string;
  bank_tran_id: string;
  currency: string;
  store_amount: string;
}

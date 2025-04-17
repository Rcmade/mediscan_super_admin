import { db } from "@/lib/db/db";
import {
  appointmentPaymentLink,
  appointmentPayments,
  appointments,
} from "@/lib/db/schema";
import { PaymentFrom } from "@/types/enum";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export const paymentWebhook = new Hono().post(
  "/payment-verification",
  async (c) => {
    const signature = c.req.header("x-razorpay-signature");
    const body = await c.req.json();
    if (body?.event === "payment.captured") {
      const isValid = validateWebhookSignature(
        JSON.stringify(body),
        signature!,
        process.env.RAZORPAY_WEBHOOK_SECRET!,
      );

      if (!isValid) {
        return c.json({ error: "Invalid signature" }, 400);
      }
      const paymentSource = body?.payload?.payment?.entity?.notes?.from;

      if (paymentSource === PaymentFrom.Appointment) {
        const paymentOrderId = body?.payload?.payment?.entity?.order_id;

        const [paymentDetails] = await db
          .select()
          .from(appointmentPayments)
          .where(eq(appointmentPayments.razorpayOrderId, paymentOrderId))
          .execute();

        if (!paymentDetails) {
          // TODO: ADD NOTIFICATION TO ADMIN LATER
          return c.json(
            {
              error: "Payment not found",
            },
            404,
          );
        }
        // Perform all operations inside a transaction
        const result = await db.transaction(async (tx) => {
          const [paymentDetails] = await tx
            .select()
            .from(appointmentPayments)
            .where(eq(appointmentPayments.razorpayOrderId, paymentOrderId))
            .execute();

          if (!paymentDetails) {
            return { error: "Payment not found" };
          }

          await tx
            .update(appointmentPayments)
            .set({ paymentStatus: "COMPLETED" })
            .where(eq(appointmentPayments.id, paymentDetails.id))
            .execute();

          const linkedAppointmentIds = await tx
            .select({ appointmentId: appointmentPaymentLink.appointmentId })
            .from(appointmentPaymentLink)
            .where(eq(appointmentPaymentLink.paymentId, paymentDetails.id))
            .execute();

          const appointmentIds = linkedAppointmentIds.map(
            (a) => a.appointmentId,
          );

          if (appointmentIds.length > 0) {
            await tx
              .update(appointments)
              .set({ isPaid: true })
              .where(inArray(appointments.id, appointmentIds))
              .execute();
          }

          return { success: true };
        });

        return c.json(result);
        // TODO: ADD MORE PAYMENT VERIFICATION LOGIC LATER
        // }  else if ( body?.payload?.payment?.entity?.notes?.from === PaymentFrom.Subscription) {}
      } else {
        return c.json(
          {
            error: "Invalid payment source",
          },
          400,
        );
      }
    }
    // console.log(JSON.stringify({ signature, body, isValid }, null, 2));
  },
);

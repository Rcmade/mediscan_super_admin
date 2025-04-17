import { APPOINTMENT_ID_HASH_NAME } from "@/constant";
import { db } from "@/lib/db/db";
import {
  appointmentPaymentLink,
  appointmentPayments,
  appointments,
  users,
} from "@/lib/db/schema";
import { decryptAppointmentIds } from "@/lib/utils/encryptionFormatDataUtils";
import { calculateTotalAppointmentCost } from "@/lib/utils/mathUtils";
import { PaymentFrom } from "@/types/enum";
import { appointmentPaymentInitiateSchema } from "@/zodSchema/payments/appointmentPaymentSchema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, or } from "drizzle-orm";
import { Hono } from "hono";
import Razorpay from "razorpay";

const appointmentPaymentRoutes = new Hono()
  .post(
    "/initiate",
    zValidator("json", appointmentPaymentInitiateSchema),
    async (c) => {
      const body = c.req.valid("json");

      const appointmentIds = decryptAppointmentIds(
        body[APPOINTMENT_ID_HASH_NAME],
      );
      if (!appointmentIds) {
        return c.json({ error: "Invalid appointment IDs" }, 400);
      }

      const appointmentsDb = await db
        .select({
          id: appointments.id,
          patientName: appointments.patientName,
          reasonForVisit: appointments.reasonForVisit,
          tokenNumber: appointments.tokenNumber,
          organizationId: appointments.organizationId,
          userId: appointments.userId,
        })
        .from(appointments)
        .where(or(...appointmentIds.map(({ id }) => eq(appointments.id, id))));

      if (appointmentsDb.length === 0) {
        return c.json({ error: "No appointments found" }, 404);
      }

      const { appointmentWithCost, totalCost } =
        calculateTotalAppointmentCost(appointmentsDb);

      const organizationId = appointmentsDb[0].organizationId;
      const userId = appointmentsDb[0].userId;

      const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      // TODO:Add Cash payment options
      const order = await instance.orders.create({
        amount: Math.ceil(+(totalCost * 100)), // Razorpay expects paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          from: PaymentFrom.Appointment,
          appointmentIds: body[APPOINTMENT_ID_HASH_NAME],
        },
      });

      // Begin DB transaction
      const result = await db.transaction(async (tx) => {
        // 1. Insert appointment payment record
        const [paymentRecord] = await tx
          .insert(appointmentPayments)
          .values({
            userId: userId!,
            organizationId: organizationId!,
            totalAmount: String(totalCost),
            paymentMethod: body.paymentMethods,
            razorpayOrderId: order.id,
          })
          .returning({ id: appointmentPayments.id });

        // 2. Link each appointment with the payment and individual cost
        await tx.insert(appointmentPaymentLink).values(
          appointmentWithCost.map((appointment) => ({
            appointmentId: appointment.appointment.id!,
            paymentId: paymentRecord.id,
            userId: userId!,
            amount: String(appointment.cost?.price || 0),
          })),
        );

        return { paymentId: paymentRecord.id };
      });

      const [userInfo] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return c.json({
        message: "Say Hi to Hassle-Free Payments!",
        orderId: order.id,
        razorpayOrder: order,
        totalAmount: totalCost,
        appointmentWithCost,
        paymentId: result.paymentId,
        userInfo,
      });
    },
  )
  .get("/view/u/:userId/o/:orderId", async (c) => {
    const userId = c.req.param("userId");
    const orderId = c.req.param("orderId");
    const data = await db
      .select({
        payment: {
          id: appointmentPayments.id,
          totalAmount: appointmentPayments.totalAmount,
          paymentMethod: appointmentPayments.paymentMethod,
          paymentStatus: appointmentPayments.paymentStatus,
          createdAt: appointmentPayments.createdAt,
          updatedAt: appointmentPayments.updatedAt,
        },
        paymentLink: {
          id: appointmentPaymentLink.id,
          amount: appointmentPaymentLink.amount,
        },
        appointment: {
          id: appointments.id,
          patientName: appointments.patientName,
          reasonForVisit: appointments.reasonForVisit,
          appointmentStatus: appointments.appointmentStatus,
          tokenNumber: appointments.tokenNumber,
          image: appointments.image,
          isPaid: appointments.isPaid,
        },
      })
      .from(appointmentPayments)
      .where(
        and(
          eq(appointmentPayments.razorpayOrderId, orderId),
          eq(appointmentPayments.userId, userId),
        ),
      )
      .leftJoin(
        appointmentPaymentLink,
        eq(appointmentPaymentLink.paymentId, appointmentPayments.id),
      )
      .leftJoin(
        appointments,
        eq(appointments.id, appointmentPaymentLink.appointmentId),
      );

    const grouped = Object.values(
      data.reduce(
        (acc, row) => {
          const paymentId = row.payment.id;

          if (!acc[paymentId]) {
            acc[paymentId] = {
              payment: row.payment,
              appointments: [],
            };
          }

          acc[paymentId].appointments.push({
            paymentLink: row.paymentLink,
            appointment: row.appointment,
          });

          return acc;
        },
        {} as Record<
          string,
          {
            payment: (typeof data)[0]["payment"];
            appointments: {
              paymentLink: (typeof data)[0]["paymentLink"];
              appointment: (typeof data)[0]["appointment"];
            }[];
          }
        >,
      ),
    );

    // return c.json({ data: grouped });
    const first = Object.values(grouped)[0];
    return c.json({ data: first });
  });

export default appointmentPaymentRoutes;

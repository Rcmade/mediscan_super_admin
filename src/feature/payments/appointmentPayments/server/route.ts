import { currentUser } from "@/action/currentUser";
import { APPOINTMENT_ID_HASH_NAME } from "@/constant";
import { db } from "@/lib/db/db";
import {
  appointmentPaymentLinks,
  appointmentPayments,
  appointments,
  organizations,
  users,
} from "@/lib/db/schema";
import { decryptAppointmentIds } from "@/lib/utils/encryptionFormatDataUtils";
import { calculateTotalAppointmentCost } from "@/lib/utils/mathUtils";
import { getOrgByUserId } from "@/queries/orgQuery";
import { PaymentFrom } from "@/types/enum";
import {
  appointmentPaymentConfirmSchema,
  appointmentPaymentInitiateSchema,
} from "@/zodSchema/payments/appointmentPaymentSchema";
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import Razorpay from "razorpay";
import type { Orders } from "razorpay/dist/types/orders";
import { updateAppointmentPaymentStatus } from "../queries/appointmentQueries";
import { formatError } from "@/lib/utils/stringUtils";
import { appointmentPaginationSchema } from "@/zodSchema/paginationSchema";
import { tableLimitArr } from "@/content";

const appointmentPaymentRoutes = new Hono()
  .post(
    "/initiate",
    zValidator("json", appointmentPaymentInitiateSchema),
    async (c) => {
      try {
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
          .where(
            or(...appointmentIds.map(({ id }) => eq(appointments.id, id))),
          );

        if (appointmentsDb.length === 0) {
          return c.json({ error: "No appointments found" }, 404);
        }

        const { appointmentWithCost, totalCost } =
          calculateTotalAppointmentCost(appointmentsDb);

        const organizationId = appointmentsDb[0].organizationId;
        const userId = appointmentsDb[0].userId;

        const paymentMethod = body.paymentMethods; // "ONLINE" | "CASH"

        const instance = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID as string,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        // TODO:Add Cash payment options
        let order: Orders.RazorpayOrder | null = null;
        if (paymentMethod == "ONLINE") {
          order = await instance.orders.create({
            amount: Math.ceil(+(totalCost * 100)), // Razorpay expects paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
              from: PaymentFrom.Appointment,
              appointmentIds: body[APPOINTMENT_ID_HASH_NAME],
            },
          });
        }

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
              razorpayOrderId: order?.id,
            })
            .returning({ id: appointmentPayments.id });

          // 2. Link each appointment with the payment and individual cost
          await tx.insert(appointmentPaymentLinks).values(
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
          message:
            paymentMethod === "ONLINE"
              ? "Say Hi to Hassle-Free Payments!"
              : "Your appointment is confirmed, please pay at the reception",
          orderId: order?.id || null,
          razorpayOrder: order,
          totalAmount: totalCost,
          appointmentWithCost,
          paymentId: result.paymentId,
          userInfo,
          paymentMethod,
        });
      } catch (error) {
        const err = formatError(error);
        return c.json({ error: err.message }, err.statusCode);
      }
    },
  )
  .get("/view/u/:userId/o/:paymentId", async (c) => {
    try {
      // const userId = c.req.param("userId");
      const paymentId = c.req.param("paymentId");
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
            amount: appointmentPaymentLinks.amount,
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
            eq(appointmentPayments.id, paymentId),
            // eq(appointmentPayments.userId, userId),
          ),
        )
        .leftJoin(
          appointmentPaymentLinks,
          eq(appointmentPaymentLinks.paymentId, appointmentPayments.id),
        )
        .leftJoin(
          appointments,
          eq(appointments.id, appointmentPaymentLinks.appointmentId),
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
    } catch (error) {
      const err = formatError(error);
      return c.json({ error: err.message }, err.statusCode);
    }
  })
  // .get("/view/a/:appointmentId", async (c) => {
  //   const appointmentId = c.req.param("appointmentId");

  //   const data = await db
  //     .select({
  //       payment: {
  //         id: appointmentPayments.id,
  //         totalAmount: appointmentPayments.totalAmount,
  //         paymentMethod: appointmentPayments.paymentMethod,
  //         paymentStatus: appointmentPayments.paymentStatus,
  //         orgId: appointmentPayments.organizationId,
  //         createdAt: appointmentPayments.createdAt,
  //         updatedAt: appointmentPayments.updatedAt,
  //       },
  //       paymentLink: {
  //         // id: appointmentPaymentLinks.id,
  //         amount: appointmentPaymentLinks.amount,
  //       },
  //       appointment: {
  //         id: appointments.id,
  //         patientName: appointments.patientName,
  //         reasonForVisit: appointments.reasonForVisit,
  //         appointmentStatus: appointments.appointmentStatus,
  //         tokenNumber: appointments.tokenNumber,
  //         image: appointments.image,
  //         isPaid: appointments.isPaid,
  //       },
  //       user: {
  //         id: users.id,
  //         name: users.name,
  //         phone: users.phone,
  //       },
  //     })
  //     .from(appointmentPaymentLinks)
  //     .where(eq(appointmentPaymentLinks.appointmentId, appointmentId))
  //     .innerJoin(
  //       appointmentPayments,
  //       eq(appointmentPayments.id, appointmentPaymentLinks.paymentId),
  //     )
  //     .innerJoin(
  //       appointments,
  //       eq(appointments.id, appointmentPaymentLinks.appointmentId),
  //     )
  //     .innerJoin(
  //       users,
  //       eq(users.id, appointments.userId), // assuming appointments.userId exists
  //     );

  //   const grouped = Object.values(
  //     data.reduce(
  //       (acc, row) => {
  //         if (!row.payment) {
  //           throw new Error(`Missing payment for appointment ${appointmentId}`);
  //         }
  //         const paymentId = row.payment.id;

  //         if (!acc[paymentId]) {
  //           acc[paymentId] = {
  //             payment: row.payment,
  //             user: row.user,
  //             appointments: [],
  //           };
  //         }

  //         acc[paymentId].appointments.push({
  //           paymentLink: row.paymentLink,
  //           appointment: row.appointment,
  //         });

  //         return acc;
  //       },
  //       {} as Record<
  //         string,
  //         {
  //           payment: (typeof data)[0]["payment"];
  //           user: (typeof data)[0]["user"];
  //           appointments: {
  //             paymentLink: (typeof data)[0]["paymentLink"];
  //             appointment: (typeof data)[0]["appointment"];
  //           }[];
  //         }
  //       >,
  //     ),
  //   );

  //   const first = Object.values(grouped)[0];
  //   return c.json({ data: first });
  // })

  .get("/view/a/:appointmentId", async (c) => {
    const appointmentId = c.req.param("appointmentId");

    // Step 1: Get the paymentId from the appointment
    const link = await db
      .select({
        paymentId: appointmentPaymentLinks.paymentId,
      })
      .from(appointmentPaymentLinks)
      .where(eq(appointmentPaymentLinks.appointmentId, appointmentId))
      .limit(1);

    if (!link.length) {
      return c.json(
        { error: "No payment link found for this appointment" },
        404,
      );
    }

    const paymentId = link[0].paymentId;

    // Step 2: Get all appointments linked to that paymentId
    const data = await db
      .select({
        payment: {
          id: appointmentPayments.id,
          totalAmount: appointmentPayments.totalAmount,
          paymentMethod: appointmentPayments.paymentMethod,
          paymentStatus: appointmentPayments.paymentStatus,
          orgId: appointmentPayments.organizationId,
          createdAt: appointmentPayments.createdAt,
          updatedAt: appointmentPayments.updatedAt,
        },
        paymentLink: {
          amount: appointmentPaymentLinks.amount,
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
        user: {
          id: users.id,
          name: users.name,
          phone: users.phone,
        },
      })
      .from(appointmentPaymentLinks)
      .where(eq(appointmentPaymentLinks.paymentId, paymentId))
      .innerJoin(
        appointmentPayments,
        eq(appointmentPayments.id, appointmentPaymentLinks.paymentId),
      )
      .innerJoin(
        appointments,
        eq(appointments.id, appointmentPaymentLinks.appointmentId),
      )
      .innerJoin(users, eq(users.id, appointments.userId));

    const grouped = Object.values(
      data.reduce(
        (acc, row) => {
          const paymentId = row.payment.id;

          if (!acc[paymentId]) {
            acc[paymentId] = {
              payment: row.payment,
              user: row.user,
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
            user: (typeof data)[0]["user"];
            appointments: {
              paymentLink: (typeof data)[0]["paymentLink"];
              appointment: (typeof data)[0]["appointment"];
            }[];
          }
        >,
      ),
    );

    const first = Object.values(grouped)[0];
    return c.json({ data: first });
  })
  .post(
    "/o/:orgWebName/confirm-payment",
    zValidator("json", appointmentPaymentConfirmSchema),
    async (c) => {
      try {
        const body = c.req.valid("json");
        const user = await currentUser();
        if (!user || !user.id) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [existingUser] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id));

        if (
          existingUser?.role !== "RECEPTIONIST" &&
          existingUser?.role !== "ADMIN" &&
          existingUser?.role !== "SUPER_ADMIN"
        ) {
          return c.json({ error: "Forbidden" }, 403);
        }

        if (existingUser?.role !== "SUPER_ADMIN") {
          const userOrg = await getOrgByUserId(user.id);
          if (!userOrg) {
            return c.json({ error: "Organization not found" }, 404);
          }

          if (userOrg.orgId !== body.organization.id) {
            return c.json({ error: "Forbidden" }, 403);
          }
        }

        const updatePaymentStatus = await updateAppointmentPaymentStatus({
          id: body.payment.id,
          orgId: body.organization.id,
          type: "payment_id",
        });

        return c.json(
          updatePaymentStatus,
          updatePaymentStatus.status === 404 ? 404 : 200,
        );
      } catch (error) {
        const err = formatError(error);
        return c.json({ error: err.message }, err.statusCode);
      }
    },
  )
  .get(
    "/o/:doctorWebName",
    zValidator("query", appointmentPaginationSchema),
    async (c) => {
      const doctorWebName = c.req.param("doctorWebName");

      const {
        limit = tableLimitArr[0],
        page = 1,
        search,
        fromDate,
        toDate,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = appointmentPaginationSchema.parse(c.req.valid("query"));


      const offset = (page - 1) * limit;

      try {
        let query = db
          .select({
            payment: {
              id: appointmentPayments.id,
              totalAmount: appointmentPayments.totalAmount,
              paymentStatus: appointmentPayments.paymentStatus,
              createdAt: appointmentPayments.createdAt,
              organizationId: appointmentPayments.organizationId,
            },
            appointment: {
              id: appointments.id,
              patientName: appointments.patientName,
            },
            organization: {
              doctorWebName: organizations.doctorWebName,
            },
          })
          .from(appointmentPayments)
          .innerJoin(
            appointments,
            eq(appointmentPayments.userId, appointments.userId),
          )
          .innerJoin(
            organizations,
            eq(appointmentPayments.organizationId, organizations.id),
          )
          .$dynamic();

        // Filters
        const filters = [eq(organizations.doctorWebName, doctorWebName)];

        if (search) {
          filters.push(
            sql`LOWER(${appointments.patientName}) LIKE LOWER(${`%${search}%`})`,
          );
        }
        if (fromDate) {
          filters.push(gte(appointmentPayments.createdAt, new Date(fromDate)));
        }

        if (toDate) {
          filters.push(lte(appointmentPayments.createdAt, new Date(toDate)));
        }

        if (filters.length > 0) {
          query = query.where(and(...filters));
        }

        // Sorting
        query = query.orderBy(
          sortOrder === "desc"
            ? desc(appointmentPayments[sortBy])
            : asc(appointmentPayments[sortBy]),
        );

        const [data, total] = await Promise.all([
          query.offset(offset).limit(limit).execute(),
          db
            .select({ total: count() })
            .from(appointmentPayments)
            .innerJoin(
              appointments,
              eq(appointmentPayments.userId, appointments.userId),
            )
            .innerJoin(
              organizations,
              eq(appointmentPayments.organizationId, organizations.id),
            )
            .where(and(...filters))
            .execute(),
        ]);

        return c.json({
          data,
          pagination: {
            page,
            limit,
            total: total[0]?.total || 0,
          },
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        return c.json({ error: "Something went wrong" }, 500);
      }
    },
  );

export default appointmentPaymentRoutes;

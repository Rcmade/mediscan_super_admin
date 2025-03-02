import { revisitScheduleHeaderName } from "@/constant";
import { db } from "@/lib/db/db";
import { appointments, users } from "@/lib/db/schema";
import { isValidSecret } from "@/lib/utils/cryptoUtils";
import { dateRangeBaseSchema, withDateRangeValidation } from "@/zodSchema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gte, lte, notInArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

export const schedulesRoutes = new Hono().post(
  "/",
  zValidator(
    "header",
    z.object({
      [revisitScheduleHeaderName]: z.string().min(5),
    }),
  ),

  zValidator(
    "json",
    withDateRangeValidation(z.object({ ...dateRangeBaseSchema.shape })),
  ),
  async (c) => {
    const secret = c.req.header(revisitScheduleHeaderName);
    if (!secret) return c.json({ message: "Header not found" }, 400);

    const isValidateHeader = isValidSecret(secret);
    if (!isValidateHeader) return c.json({ message: "Invalid Header" }, 400);

    const { startDate, endDate } = c.req.valid("json");

    const conditions = [];

    if (startDate) {
      conditions.push(gte(appointments.revisitTime, startDate));
    }

    if (endDate) {
      conditions.push(lte(appointments.revisitTime, endDate));
    }

    // Exclude RECEPTIONIST & ADMIN roles
    conditions.push(notInArray(users.role, ["RECEPTIONIST", "ADMIN"]));

    const data = await db
      .select({
        // appointmentId: appointments.id,
        // userId: appointments.userId,
        // patientName: appointments.patientName,
        phone: users.phone, // Fetch user's phone number
        revisitTime: appointments.revisitTime,
        // appointmentStatus: appointments.appointmentStatus,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id)) // Join with users table
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return c.json(data);
  },
);

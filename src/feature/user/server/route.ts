import { currentUser } from "@/action/currentUser";
import { db } from "@/lib/db/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export const userRoutes = new Hono().get("/history", async (c) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return c.json(
      {
        error: "Not authorized",
      },
      403,
    );
  }

  const userAppointments = await db
    .select({
      id: appointments.id,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      patientName: appointments.patientName,
      reasonForVisit: appointments.reasonForVisit,
      tokenNumber: appointments.tokenNumber,
      image: appointments.image,
      revisitTime: appointments.revisitTime,
    })
    .from(appointments)
    .where(eq(appointments.userId, user.id));

  return c.json({
    appointments: userAppointments,
  });
});

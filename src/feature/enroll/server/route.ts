import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  enrollmentSchema,
  EnrollmentSchemaT,
} from "@/zodSchema/enrollmentSchema";
import { signIn } from "@/config/authConfig";
import { db } from "@/lib/db/db";
import {
  users,
  appointments,
  InsertAppointmentsT,
  AppointmentStatusT,
  organizations,
} from "@/lib/db/schema"; // Assuming you have an appointments and sessions table
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import { currentUser } from "@/action/currentUser";

export const enrollmentRoute = new Hono().post(
  "/:webName",
  zValidator("json", enrollmentSchema),
  async (c) => {
    const body = c.req.valid("json");
    const webName = c.req.param("webName");
    try {
      const validPhone = normalizePhoneNumber(body.phone);
      if (!validPhone) {
        return c.json({ error: "Invalid phone number" }, 400);
      }

      // Fetch organizationId from webName
      const [organization] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.doctorWebName, webName))
        .limit(1);

      if (!organization) {
        return c.json({ error: "Organization not found" }, 404);
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.phone, validPhone))
        .limit(1);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Set to the start of today (midnight)

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // Set to the end of today (23:59:59.999)

      // Fetch the latest appointment and get the highest token number
      const [getLastToken] = await db
        .select({ token: appointments.tokenNumber })
        .from(appointments)
        .where(
          and(
            eq(appointments.organizationId, organization.id),
            gte(appointments.createdAt, todayStart), // Start of today
            lte(appointments.createdAt, todayEnd), // End of today
          ),
        )
        .orderBy(desc(appointments.createdAt), desc(appointments.tokenNumber)) // Sort by createdAt and tokenNumber
        .limit(1); // Get only the latest document with highest tokenNumber

      const latestTokenNumber = getLastToken ? +getLastToken.token : 0; // If no appointments, start at 0

      const user =
        existingUser ||
        (
          await db
            .insert(users)
            .values({
              name: body.patients[0].patientName,
              phone: validPhone,
            })
            .returning()
        )[0];

      let shouldSignIn = true;
      // we don't want to sign in again when appointments is created by logged in admin or receptionist person, it will help to prevent update current user session
      if (
        body.from === "ADMIN" ||
        body.from === "RECEPTIONIST" ||
        body.from == "SUPER_ADMIN"
      ) {
        const currentUserInfo = await currentUser();
        if (currentUserInfo?.id) {
          const [findAdminOrReceptionUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, currentUserInfo.id));
          if (currentUserInfo.role === findAdminOrReceptionUser.role) {
            shouldSignIn = false; // Skip sign-in if current user role matches the `from` value
          }
        }
      }

      if (shouldSignIn) {
        await signIn("credentials", {
          name: user.name,
          phone: user.phone,
          role: user.role,
          redirect: false,
        });
      }

      // Format data for appointments with organizationId
      const formattedData: InsertAppointmentsT[] = formatData({
        body,
        userId: user.id,
        latestTokenNumber: latestTokenNumber + 1, // Start token numbers from the next available number
        organizationId: organization.id,
      });
      // Insert new appointments
      const result = await db
        .insert(appointments)
        .values(formattedData)
        .returning({
          token: appointments.tokenNumber,
          patientName: appointments.patientName,
          id: appointments.id,
        });

      return c.json(
        {
          message: existingUser
            ? "Session updated and new appointment scheduled"
            : "User created and appointment scheduled",
          data: {
            phone: user.phone,
            appointments: result,
          },
        },
        201,
      );
    } catch (error) {
      console.log(error);
      return c.json({ error: "An error occurred" }, 500);
    }
  },
);

export const formatData = ({
  body,
  userId,
  latestTokenNumber,
  organizationId,
}: {
  body: EnrollmentSchemaT;
  userId: string;
  organizationId: string;
  latestTokenNumber: number;
}) => {
  return body.patients.map((p, i) => ({
    patientName: p.patientName,
    reasonForVisit: p.reasonForVisit,
    appointmentStatus: "Scheduled" as AppointmentStatusT,
    tokenNumber: String(latestTokenNumber + i), // Increment tokenNumber sequentially
    userId,
    createdAt: new Date(),
    organizationId: organizationId,
  }));
};

import { Hono } from "hono";
import { db } from "@/lib/db/db";
import { appointments, users } from "@/lib/db/schema";
import {
  and,
  desc,
  eq,
  gte,
  ilike,
  lte,
  // count,
  or,
  sql,
  asc,
  count,
} from "drizzle-orm";
import { endOfDay, startOfDay } from "date-fns";
import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import { zValidator } from "@hono/zod-validator";
import { paginationSchema } from "@/zodSchema/paginationSchema";
import { appointmentSchema } from "@/zodSchema/appointmentSchema";
import { currentUser } from "@/action/currentUser";
import { deleteCldResources } from "@/lib/utils/serverCldUtils";
import { getCloudinaryId } from "@/lib/utils/cloudinaryUtils";
import { isValidDate } from "@/lib/utils/dateUtils";

export const tokenRoute = new Hono()
  .get("/recent/:phoneNo", async (c) => {
    const { phoneNo } = c.req.param();

    const normalizedPhone = normalizePhoneNumber(phoneNo);
    if (!phoneNo || !normalizedPhone) {
      return c.json({ error: "Phone ID is required" }, 400);
    }

    try {
      // Step 1: Retrieve the user based on phone number
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.phone, normalizedPhone))
        .limit(1);
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      // Step 2: Get today's date range (start of the day and end of the day)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Start of today
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // End of today

      // Step 3: Retrieve all appointments created today for the user
      const tokens = await db
        .select({
          token: appointments.tokenNumber,
          createdAt: appointments.createdAt,
          patientName: appointments.patientName,
          id: appointments.id,
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.userId, user.id), // Ensure we're querying for the correct user
            gte(appointments.createdAt, todayStart), // Filter for today's appointments
            lte(appointments.createdAt, todayEnd), // Filter for today's appointments
          ),
        )
        .orderBy(appointments.createdAt); // Order by createdAt to get the correct sequence

      // Step 4: Return the result in the desired format
      const formattedTokens = tokens.map((token) => ({
        ...token,
        //   token: token.token,
        // createdAt: format(new Date(token.createdAt), "yyyy-MM-dd HH:mm:ss.SSS"), // Format the date
      }));

      return c.json(formattedTokens);
    } catch (error) {
      console.error(error);
      return c.json(
        { error: "An error occurred while fetching the data" },
        500,
      );
    }
  })
  .get("/display", zValidator("query", paginationSchema), async (c) => {
    try {
      const query = c.req.query();
      const { limit = 20 } = paginationSchema.parse(query);

      // Get today's start and end timestamps
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());

      // Fetch top scheduled appointments sorted by tokenNumber and within today
      const scheduledTokens = await db
        .select({
          tokenNumber: appointments.tokenNumber,
          patientName: appointments.patientName,
          appointmentStatus: appointments.appointmentStatus,
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.appointmentStatus, "Scheduled"),
            gte(appointments.createdAt, todayStart),
            lte(appointments.createdAt, todayEnd),
          ),
        )
        .orderBy(asc(appointments.tokenNumber)) // Sort by token number
        .limit(limit); // Limit the results for efficiency

      // Return the response
      return c.json({
        data: scheduledTokens,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching scheduled tokens:", error);
      return c.json({ error: "Failed to fetch scheduled tokens" }, 500);
    }
  })

  .get("/search", zValidator("query", paginationSchema), async (c) => {
    // Validate query parameters
    const query = c.req.query();
    const {
      limit = 15,
      page = 1,
      search,
      startTime: startTimeString,
      endOfDay: endOfDayString,
      isGlobalSearch,
    } = paginationSchema.parse(query);
    // Pagination calculations
    const offset = (page - 1) * limit;

    // Base query with multiple field search
    const cleanSearch = search ? search : undefined;

    const baseConditions = cleanSearch
      ? or(
          ilike(appointments.patientName, `%${cleanSearch}%`),
          ilike(users.phone, `%${cleanSearch}%`),
          ilike(sql`${appointments.tokenNumber}::text`, `%${cleanSearch}%`), // Cast numeric to text using raw SQL
        )
      : undefined;

    // Query to fetch today's appointments
    const todayConditions = isGlobalSearch
      ? undefined
      : and(
          startTimeString && gte(appointments.createdAt, startTimeString),
          endOfDayString && lte(appointments.createdAt, endOfDayString),
        );

    try {
      // Fetch scheduled and today's appointments in a single query
      const [appointmentsData, totalRecords] = await Promise.all([
        db
          .select({
            id: appointments.id,
            tokenNumber: appointments.tokenNumber,
            patientName: appointments.patientName,
            reasonForVisit: appointments.reasonForVisit,
            createdAt: appointments.createdAt,
            appointmentStatus: appointments.appointmentStatus,
            phone: users.phone, // Include phone in the select query,
          })
          .from(appointments)
          .leftJoin(users, eq(appointments.userId, users.id)) // Join with the `users` table
          .where(
            and(
              eq(appointments.appointmentStatus, "Scheduled"),
              baseConditions,
              todayConditions,
            ),
          )
          .orderBy(desc(appointments.createdAt), desc(appointments.tokenNumber))
          .offset(offset)
          .limit(limit),
        db
          .select({ total: count() })
          .from(appointments)
          .leftJoin(users, eq(appointments.userId, users.id)) // Join with `users` table for total count
          .where(and(baseConditions, todayConditions)), // Count total records
      ]);
      const formatData = {
        query: paginationSchema.parse(query),
        data: appointmentsData,
        pagination: {
          total: +totalRecords[0].total,
          page,
          limit,
        },
      };

      return c.json(formatData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return c.json({ error: "Failed to fetch appointments" }, 500);
    }
  })
  .get("/t/:appointmentId", async (c) => {
    const { appointmentId } = c.req.param();

    if (!appointmentId) {
      return c.json({ error: "Token ID is required" }, 400);
    }
    const [token] = await db
      .select({
        patientName: appointments.patientName,
        tokenNumber: appointments.tokenNumber,
        appointmentStatus: appointments.appointmentStatus,
        image: appointments.image,
        phone: users.phone,
        reasonForVisit: appointments.reasonForVisit,
        createdAt: appointments.createdAt,
        id: appointments.id,
        revisitTime: appointments.revisitTime,
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userId, users.id)) // Join with the `users` table
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    return c.json(token);
  })
  .post(
    "/t/:appointmentId",
    zValidator("json", appointmentSchema.partial()),
    async (c) => {
      const { appointmentId } = c.req.param();
      const user = await currentUser();
      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const [permissionUser] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (
        permissionUser.role !== "ADMIN" &&
        permissionUser.role !== "RECEPTIONIST"
      ) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const {
        patientName,
        appointmentStatus,
        reasonForVisit,
        image,
        deletedImage,
        revisitTime = undefined,
      } = c.req.valid("json");
      let imgUrl: string | null = null;

      if (typeof image === "string") {
        imgUrl = image;
      }
      if (!appointmentId) {
        return c.json({ error: "Appointment ID is required" }, 400);
      }

      try {
        if (deletedImage) {
          if (imgUrl && deletedImage === getCloudinaryId(imgUrl)) {
            imgUrl = null;
          }
          deleteCldResources([deletedImage]);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }

      try {
        const [updatedToken] = await db
          .update(appointments)
          .set({
            patientName: patientName,
            appointmentStatus,
            reasonForVisit,
            image: imgUrl,
            revisitTime:
              revisitTime && isValidDate(revisitTime)
                ? new Date(revisitTime)
                : undefined,
          })
          .where(eq(appointments.id, appointmentId))
          .returning({
            patientName: appointments.patientName,
            appointmentStatus: appointments.appointmentStatus,
            image: appointments.image,
            reasonForVisit: appointments.reasonForVisit,
            createdAt: appointments.createdAt,
            id: appointments.id,
          });

        return c.json({
          data: updatedToken,
          message: "Appointment updated successfully",
        });
      } catch (error) {
        console.error("Error updating token:", error);
        return c.json({ error: "Failed to update token" }, 500);
      }
    },
  );

import { currentUser } from "@/action/currentUser";
import { db } from "@/lib/db/db";
import {
  appointments,
  organizations,
  orgBusinessProfile,
  orgLegalInfo,
  users,
} from "@/lib/db/schema";
import { formatError } from "@/lib/utils/stringUtils";
import { dashboardStatsQuerySchema } from "@/zodSchema/dashboardStatsSchema";
import { createOrgBusinessProfile } from "@/zodSchema/organizationSchema";
import { zValidator } from "@hono/zod-validator";
import { between, sql, desc, eq, and } from "drizzle-orm";
import { Hono } from "hono";

// const dashBoardRoute = new Hono().get("/stats", async (c) => {
//   // Get today's start and end timestamps
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Start of the day
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1); // Start of the next day

//   const results = await db
//     .select({
//       appointmentStatus: appointments.appointmentStatus,
//       count: count(),
//     })
//     .from(appointments)
//     .where(
//       and(
//         gte(appointments.createdAt, today), // Ensure appointment is from today
//         lt(appointments.createdAt, tomorrow), // Before tomorrow
//       ),
//     )
//     .groupBy(appointments.appointmentStatus);

//   // Transform into the desired structure
//   const data = {
//     bookedAppointments:
//       results.find((row) => row.appointmentStatus === "Scheduled")?.count || 0,
//     confirmedAppointments:
//       results.find((row) => row.appointmentStatus === "Completed")?.count || 0,
//     cancelledAppointments:
//       results.find((row) => row.appointmentStatus === "Cancelled")?.count || 0,
//   };
//   return c.json(data);
// });

// export default dashBoardRoute;

const dashBoardRoute = new Hono()
  .get(
    "/stats/:webName",
    zValidator("query", dashboardStatsQuerySchema),
    async (c) => {
      const webName = c.req.param("webName");
      // Validate date range from query parameters
      const parseQuery = dashboardStatsQuerySchema.safeParse(c.req.query());

      if (!parseQuery.success) {
        return c.json(
          { message: "Invalid query provided", errors: parseQuery.error },
          400,
        );
      }
      try {
        const { startDate: validStartDate, endDate: validEndDate } =
          parseQuery.data;

        const start = new Date(validStartDate);
        const end = new Date(validEndDate);

        // Format dates for PostgreSQL
        const formattedStart = start.toISOString().split("T")[0];
        const formattedEnd = end.toISOString().split("T")[0];

        const [org] = await db
          .select({ id: organizations.id })
          .from(organizations)
          .where(eq(organizations.doctorWebName, webName))
          .limit(1);

        if (!org) {
          return c.json({ error: "Organization not found" }, 404);
        }

        // Get basic appointment statistics
        const statusResults = await db
          .select({
            appointmentStatus: appointments.appointmentStatus,
            count: sql<bigint>`count(*)`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.organizationId, org.id),
              between(appointments.createdAt, start, end),
            ),
          )
          .groupBy(appointments.appointmentStatus);

        // Get average appointments per day
        const avgPerDay = await db
          .select({
            average: sql<number>`cast(count(*)::float / (
            extract(days from age(${sql.raw(`'${formattedEnd}'::date`)}, ${sql.raw(`'${formattedStart}'::date`)})) + 1
          ) as float)`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.organizationId, org.id),
              between(appointments.createdAt, start, end),
            ),
          );

        // Get most common reasons for visits
        const topReasons = await db
          .select({
            reason: appointments.reasonForVisit,
            count: sql<bigint>`count(*)`,
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.organizationId, org.id),
              between(appointments.createdAt, start, end),
            ),
          )
          .groupBy(appointments.reasonForVisit)
          .orderBy(desc(sql`count(*)`))
          .limit(5);

        const busiestHours = await db
          .select({
            hour: sql<number>`extract(hour from ${appointments.createdAt})`, // Extract the hour only
            count: sql<number>`count(*)`, // Count total appointments per hour
          })
          .from(appointments)
          .where(
            and(
              eq(appointments.organizationId, org.id),
              between(appointments.createdAt, start, end),
            ),
          )
          .groupBy(sql`extract(hour from ${appointments.createdAt})`) // Group by extracted hour
          .orderBy(desc(sql`count(*)`)) // Order by most appointments
          .limit(5);

        const data = {
          appointmentStats: {
            total: statusResults.reduce(
              (acc, row) => acc + Number(row.count),
              0,
            ),
            scheduled:
              statusResults.find((row) => row.appointmentStatus === "Scheduled")
                ?.count || 0,
            completed:
              statusResults.find((row) => row.appointmentStatus === "Completed")
                ?.count || 0,
            cancelled:
              statusResults.find((row) => row.appointmentStatus === "Cancelled")
                ?.count || 0,
          },
          operationalMetrics: {
            averageAppointmentsPerDay: Number(
              avgPerDay[0]?.average || 0,
            ).toFixed(2),
            completionRate: calculateCompletionRate(statusResults),
            cancellationRate: calculateCancellationRate(statusResults),
          },
          trends: {
            topVisitReasons: topReasons.map((r) => ({
              reason: r.reason,
              count: Number(r.count),
            })),

            busiestHours,
          },
          dateRange: {
            start: start.toISOString(),
            end: end.toISOString(),
            numberOfDays: Math.ceil(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
            ),
          },
        };

        return c.json(data);
      } catch (error) {
        console.error({ error });
        return c.json({ message: "Something went wrong.", errors: error }, 400);
      }
    },
  )
  .post(
    "/o/:orgName/business-profile",
    zValidator("json", createOrgBusinessProfile),
    async (c) => {
      try {
        const body = c.req.valid("json");
        const orgName = c.req.param("orgName");
        const user = await currentUser();
        if (!user || !user.id) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const [existingUser] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id));

        if (existingUser?.role !== "SUPER_ADMIN") {
          return c.json(
            { error: "Forbidden. You don't have access to these resources!" },
            403,
          );
        }

        if (!orgName) {
          return c.json({ error: "Organization web name is required" }, 400);
        }

        const [getOrg] = await db
          .select({
            id: organizations.id,
            doctorWebName: organizations.doctorWebName,
          })
          .from(organizations)
          .where(eq(organizations.doctorWebName, orgName));

        if (!getOrg) {
          return c.json(
            {
              error: "Organization not found",
            },
            404,
          );
        }
        // insertBusinessProfile
        const [] = await db
          .insert(orgBusinessProfile)
          .values({
            organizationId: getOrg.id,
            category: body.category,
            street1: body.address.street1,
            street2: body.address.street2,
            city: body.address.city,
            state: body.address.state,
            postalCode: body.address.postalCode,
            country: body.address.country,
          })
          .returning({
            id: orgBusinessProfile.id,
          });

        if (body.legalInfo.pan || body.legalInfo.gst) {
          await db
            .insert(orgLegalInfo)
            .values({
              organizationId: getOrg.id,
              pan: body.legalInfo.pan,
              gst: body.legalInfo.gst,
            })
            .returning({
              id: orgLegalInfo.id,
            });
        }

        return c.json(
          { message: "Business profile created successfully", ...getOrg },
          201,
        );
      } catch (error) {
        const err = formatError(error);
        return c.json({ error: err.message }, err.statusCode);
      }
    },
  );

// Helper functions for calculating rates
function calculateCompletionRate(
  results: { appointmentStatus: string; count: bigint }[],
): string {
  const total = results.reduce((acc, row) => acc + Number(row.count), 0);
  const completed = Number(
    results.find((row) => row.appointmentStatus === "Completed")?.count || 0,
  );
  return total === 0 ? "0.00" : ((completed / total) * 100).toFixed(2);
}

function calculateCancellationRate(
  results: { appointmentStatus: string; count: bigint }[],
): string {
  const total = results.reduce((acc, row) => acc + Number(row.count), 0);
  const cancelled = Number(
    results.find((row) => row.appointmentStatus === "Cancelled")?.count || 0,
  );
  return total === 0 ? "0.00" : ((cancelled / total) * 100).toFixed(2);
}
export type AppType = typeof dashBoardRoute

export default dashBoardRoute;



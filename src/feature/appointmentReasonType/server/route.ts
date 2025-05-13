import { currentUser } from "@/action/currentUser";
import { db } from "@/lib/db/db";
import {
  organizations,
  orgAppointmentReasonsTypes,
  users,
} from "@/lib/db/schema";
import { formatError } from "@/lib/utils/stringUtils";
import { getOrgByUserId } from "@/queries/orgQuery";
import { appointmentReasonsTypeSchema } from "@/zodSchema/appointmentReasonsTypeSchema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const appointmentReasonsTypeRoutes = new Hono()
  .get("/o/:orgWebName", async (c) => {
    const { orgWebName } = c.req.param();

    const appointmentReasons = await db
      .select({
        reasonId: orgAppointmentReasonsTypes.id,
        name: orgAppointmentReasonsTypes.name,
        amount: orgAppointmentReasonsTypes.amount,
        organizationId: orgAppointmentReasonsTypes.organizationId,
      })
      .from(orgAppointmentReasonsTypes)
      .innerJoin(
        organizations,
        eq(orgAppointmentReasonsTypes.organizationId, organizations.id),
      )
      .where(eq(organizations.doctorWebName, orgWebName));

    return c.json({ appointmentReasons });
  })
  .post(
    "/o/:orgWebName",
    zValidator("json", appointmentReasonsTypeSchema),
    async (c) => {
      try {
        const user = await currentUser();
        if (!user || !user.id) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const orgWebName = c.req.param("orgWebName").toLowerCase();
        const body = c.req.valid("json");

        let orgId = "";
        const [existingUser] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id));

        if (
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

          orgId = userOrg.orgId;

          if (userOrg.webName?.toLowerCase() !== orgWebName) {
            return c.json({ error: "Forbidden" }, 403);
          }
        }

        if (body.appointmentReasonsTypeId) {
          const [updatedAppointmentReasonsType] = await db
            .update(orgAppointmentReasonsTypes)
            .set({
              name: body.name,
              amount: String(body.amount),
            })
            .where(
              eq(orgAppointmentReasonsTypes.id, body.appointmentReasonsTypeId),
            )
            .returning({
              id: orgAppointmentReasonsTypes.id,
            });

          return c.json({
            message: "Appointment type updated successfully",
            appointmentReasonsTypeId: updatedAppointmentReasonsType.id,
          });
        }
        if (!orgId && existingUser?.role === "SUPER_ADMIN") {
          const [org] = await db
            .select({ id: organizations.id })
            .from(organizations)
            .where(eq(organizations.doctorWebName, orgWebName));

          if (!org) {
            return c.json({ error: "Organization not found" }, 404);
          }
          orgId = org.id;
        }
        const [newAppointmentReasonsType] = await db
          .insert(orgAppointmentReasonsTypes)
          .values({
            name: body.name,
            amount: String(body.amount),
            organizationId: orgId,
          })
          .returning({
            id: orgAppointmentReasonsTypes.id,
          });

        return c.json({
          message: "Appointment type created successfully",
          appointmentReasonsTypeId: newAppointmentReasonsType.id,
        });
      } catch (error) {
        const err = formatError(error);
        return c.json({ error: err.message }, err.statusCode);
      }
    },
  )
  .delete("/o/:orgWebName/:appointmentReasonId", async (c) => {
    const user = await currentUser();
    if (!user || !user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const orgWebName = c.req.param("orgWebName").toLowerCase();

    let orgId = "";
    const [existingUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, user.id));

    if (
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

      orgId = userOrg.orgId;

      if (userOrg.webName?.toLowerCase() !== orgWebName) {
        return c.json({ error: "Forbidden" }, 403);
      }
    }

    if (!orgId && existingUser?.role === "SUPER_ADMIN") {
      const [org] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.doctorWebName, orgWebName));

      if (!org) {
        return c.json({ error: "Organization not found" }, 404);
      }
      orgId = org.id;
    }
    const appointmentReasonId = c.req.param("appointmentReasonId");
    const [deletedAppointmentReason] = await db
      .delete(orgAppointmentReasonsTypes)
      .where(eq(orgAppointmentReasonsTypes.id, appointmentReasonId))
      .returning({ id: orgAppointmentReasonsTypes.id });

    return c.json({
      message: "Appointment type deleted successfully",
      appointmentReasonId: deletedAppointmentReason.id,
    });
  });

export type AppType = typeof appointmentReasonsTypeRoutes;

export default appointmentReasonsTypeRoutes;

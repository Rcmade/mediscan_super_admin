import { currentUser } from "@/action/currentUser";
import { webName } from "@/constant";
import { db } from "@/lib/db/db";
import { organizations, organizationUsers, users } from "@/lib/db/schema";
import { normalizePhoneNumber } from "@/lib/utils/numberUtils";
import { formatError } from "@/lib/utils/stringUtils";
import SendService from "@/service/sendService";
import { createOrgUser } from "@/zodSchema/organizationSchema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

export const orgUsersRoute = new Hono().post(
  "/:orgId",
  zValidator("json", createOrgUser),
  async (c) => {
    try {
      const user = await currentUser();
      if (!user || !user.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const orgId = c.req.param("orgId");
      if (!orgId) {
        return c.json({ error: "Organization ID is required" }, 400);
      }

      const [existingUser] = await db
        .select({ role: users.role, id: users.id })
        .from(users)
        .where(eq(users.id, user.id));

      if (!existingUser) {
        return c.json({ error: "User does not exist" }, 404);
      }
      const isSuperAdmin = existingUser.role === "SUPER_ADMIN";

      if (existingUser.role !== "ADMIN" && !isSuperAdmin) {
        return c.json(
          { error: "Forbidden. You don't have access to these resources!" },
          403,
        );
      }

      const { name, phoneNumber, role } = c.req.valid("json");
      const phone = normalizePhoneNumber(phoneNumber);
      if (!phone) {
        return c.json({ errors: "Invalid phone number" }, 400);
      }
      if (existingUser.role !== "SUPER_ADMIN") {
        const [adminAccessOfOrg] = await db
          .select({ id: organizations.id })
          .from(organizations)
          .innerJoin(
            organizationUsers,
            eq(organizations.id, organizationUsers.organizationId),
          )
          .where(
            and(
              eq(organizations.id, orgId),
              eq(organizationUsers.userId, existingUser.id),
            ),
          )
          .limit(1);

        if (!adminAccessOfOrg) {
          return c.json(
            { error: "You don't have access to this organization" },
            403,
          );
        }
      }
      // Create or update the admin user
      const [createOrgUser] = await db
        .insert(users)
        .values({
          role: role,
          name: name,
          phone,
        })
        .onConflictDoUpdate({
          target: users.phone,
          set: { name: name, role: role },
        })
        .returning({ id: users.id });

      // Create the organization user
      await db
        .insert(organizationUsers)
        .values({
          userId: createOrgUser.id,
          organizationId: orgId,
        })
        .onConflictDoNothing();

      // Send OTP confirmation if the service is enabled
      if (process.env.SMS_OTP_ENABLED === "true") {
        try {
          await SendService.sendSMS(
            phone,
            `Your account has been successfully created! You can access ${webName} at ${process.env.NEXT_PUBLIC_URL}/admin/dashboard/organization/o/${orgId}.`,
          );
        } catch (error) {
          console.error(error);
          return c.json({ error: "Failed to send confirmation SMS" }, 500);
        }
      }

      return c.json({ message: "User created successfully" }, 201);
    } catch (error) {
      const err = formatError(error);
      console.error("Error in orgUsersRoute:", error);
      return c.json({ error: err.message }, err.statusCode);
    }
  },
);

import { db } from "@/lib/db/db";
import { organizations, organizationUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import "server-only";
export const getOrgByUserId = async (userId: string) => {
  const [userOrgs] = await db
    .select({
      orgId: organizations.id,
      webName: organizations.doctorWebName,
      serviceStartDate: organizations.serviceStartDate,
      serviceEndDate: organizations.serviceEndDate,
      userLimit: organizations.userLimit,
      // Add any other fields you need from organizations table
      createdAt: organizations.createdAt,
      updatedAt: organizations.updatedAt,
    })
    .from(organizationUsers)
    .innerJoin(
      organizations,
      eq(organizationUsers.organizationId, organizations.id),
    )
    .where(eq(organizationUsers.userId, userId))
    .limit(1);

  if (!userOrgs) {
    throw new Error("Organization not found");
  }

  return userOrgs;
};

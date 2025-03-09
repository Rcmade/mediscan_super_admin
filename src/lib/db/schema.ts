import {
  timestamp,
  pgTable,
  text,
  varchar,
  pgEnum,
  numeric,
  integer,
  unique,
  pgView,
} from "drizzle-orm/pg-core";
import { nId } from "@/lib/utils/dbUtils";
import {
  appointmentsReasons,
  appointmentStatusArr,
  userRoleArr,
} from "@/constant";
import { eq, sql } from "drizzle-orm";

export const appointmentStatus = pgEnum(
  "AppointmentStatus",
  appointmentStatusArr,
);

export const visitReasons = pgEnum("VisitReasons", appointmentsReasons);

const phone = varchar("phone", { length: 20 }).unique().notNull();

const commonFields = {
  id: text("id").primaryKey().$defaultFn(nId),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),
};

export const userRole = pgEnum("UserRole", userRoleArr);

export const users = pgTable("user", {
  role: userRole("role").notNull().default("USER"),
  name: text("name").notNull(),
  phone: phone,
  ...commonFields,
});
const userId = text("userId")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" });

export const organizations = pgTable("organization", {
  // doctorName: text("name").notNull(),
  doctorWebName: text("web_name").notNull().unique(),
  serviceStartDate: timestamp("service_start_date").notNull(),
  serviceEndDate: timestamp("service_end_date").notNull(),
  userLimit: integer("user_limit").notNull(),
  ...commonFields,
});

export const organizationUsers = pgTable(
  "organization_users",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    // Just for future use case
    // role: userRole("role"), // Organization-Specific Role
    ...commonFields,
  },
  (table) => ({
    // Ensures a user cannot have multiple roles in the same organization
    uniqueConstraint: unique().on(table.userId, table.organizationId),
  }),
);

export const appointments = pgTable("appointments", {
  userId: userId,
  patientName: text("patient_name").notNull(),
  reasonForVisit: visitReasons("patient_reason").notNull(),
  organizationId: text("organization_id")
    // .notNull()
    .references(() => organizations.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

  appointmentStatus: appointmentStatus("appointment_status")
    .notNull()
    .default("Scheduled"),
  tokenNumber: numeric({
    precision: 10,
    scale: 0,
  }).notNull(),
  image: text("image"),
  revisitTime: timestamp("revisit_time"),
  // organization: text("organization").references(() => organizations.id, {
  //   onDelete: "no action",
  //   onUpdate: "cascade",
  // }),
  ...commonFields,
});

// Create a SQL view for organizations with user information
// export const organizationsWithUsersView = pgView(
//   "organizations_with_users_view",
// ).as((qb) => {
//   return qb
//     .select({
//       id: organizations.id,
//       doctorWebName: organizations.doctorWebName,
//       serviceStartDate: organizations.serviceStartDate,
//       serviceEndDate: organizations.serviceEndDate,
//       userLimit: organizations.userLimit,
//       name: users.name,
//       phone: users.phone,
//       total: sql<number>`count(${organizationUsers.userId})`.as("total"),
//       role: users.role,
//       userId: organizationUsers.userId,
//     })
//     .from(organizations)
//     .leftJoin(
//       organizationUsers,
//       sql`${organizations.id} = ${organizationUsers.organizationId}`,
//     )
//     .leftJoin(users, sql`${organizationUsers.userId} = ${users.id}`)
//     .groupBy(
//       organizations.id,
//       organizations.doctorWebName,
//       organizations.serviceStartDate,
//       organizations.serviceEndDate,
//       organizations.userLimit,
//       users.name,
//       users.phone,
//     );
// });

export const organizationsWithUsersView = pgView(
  "organizations_with_users_view",
).as((qb) => {
  return qb
    .select({
      id: organizations.id,
      doctorWebName: organizations.doctorWebName,
      serviceStartDate: organizations.serviceStartDate,
      serviceEndDate: organizations.serviceEndDate,
      userLimit: organizations.userLimit,
      name: users.name,
      phone: users.phone,
      total: sql<number>`count(${organizationUsers.userId})`.as("total"),
      userId: organizationUsers.userId,
    })
    .from(organizations)
    .leftJoin(
      organizationUsers,
      eq(organizations.id, organizationUsers.organizationId),
    )
    .leftJoin(users, eq(organizationUsers.userId, users.id))
    .groupBy(
      organizations.id,
      organizations.doctorWebName,
      organizations.serviceStartDate,
      organizations.serviceEndDate,
      organizations.userLimit,
      users.name,
      users.phone,
      organizationUsers.userId, // Ensure this is present
    );
});

// Type for the view results
export type OrganizationWithUserView =
  typeof organizationsWithUsersView.$inferSelect;

export type InsertUserT = typeof users.$inferInsert;
export type SelectUserT = typeof users.$inferSelect;
export type UserRole = InsertUserT["role"];

export type InsertAppointmentsT = typeof appointments.$inferInsert;
export type SelectAppointmentsT = typeof appointments.$inferSelect;

export type EnrollmentReasonT = InsertAppointmentsT["reasonForVisit"];
export type AppointmentStatusT = InsertAppointmentsT["appointmentStatus"];

export type InsertOrganizationT = typeof organizations.$inferInsert;
export type SelectOrganizationT = typeof organizations.$inferSelect;

export type InsertOrganizationUsersT = typeof organizationUsers.$inferInsert;
export type SelectOrganizationUsersT = typeof organizationUsers.$inferSelect;

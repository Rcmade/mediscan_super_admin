import {
  timestamp,
  pgTable,
  text,
  varchar,
  pgEnum,
  numeric,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { nId } from "@/lib/utils/dbUtils";
import {
  appointmentsReasons,
  appointmentStatusArr,
  userRoleArr,
} from "@/constant";

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

export const orgTransaction = pgTable("org_transaction", {
  ...commonFields,
  total: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paid: numeric("paid", { precision: 10, scale: 2 }).notNull(),
  due: numeric("due", { precision: 10, scale: 2 }).notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
});

export const orgPaymentMethods = pgTable("org_payment_methods", {
  ...commonFields,
  name: text("name").notNull().unique(),
});

export const orgPayments = pgTable("org_payments", {
  ...commonFields,
  transactionId: text("transaction_id")
    .notNull()
    .references(() => orgTransaction.id, { onDelete: "cascade" }),
  paymentMethodId: text("payment_method_id")
    .notNull()
    .references(() => orgPaymentMethods.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});

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

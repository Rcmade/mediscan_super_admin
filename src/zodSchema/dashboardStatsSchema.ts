import { z } from "zod";
import { dateRangeBaseSchema, withDateRangeValidation } from ".";

// Example schemas with proper type inference
export const dashboardStatsQuerySchema = withDateRangeValidation(
  z.object({
    ...dateRangeBaseSchema.shape,
    // otherField: z.string().optional(),
  }),
);

// export const reportQuerySchema = withDateRangeValidation(
//   z.object({
//     ...dateRangeBaseSchema.shape,
//     reportType: z.string(),
//   }),
// );

// // Standalone date range schema
// export const dateRangeSchema = withDateRangeValidation(dateRangeBaseSchema);

// // Type helper to extract the inferred type
// export type DashboardStatsQuery = z.infer<typeof dashboardStatsQuerySchema>;
// export type ReportQuery = z.infer<typeof reportQuerySchema>;
// export type DateRange = z.infer<typeof dateRangeSchema>;

// const a = dashboardStatsQuerySchema.safeParse({
//   // startDate: "2201-01-01",
//   // endDate: "2002-01-01",
// });

// console.log(a);

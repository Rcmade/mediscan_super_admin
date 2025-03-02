import { z } from "zod";
import { phoneSchema } from ".";

// values should be from UserRole
const whoCreatedEnrollment = [
  "USER",
  "RECEPTIONIST",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export const enrollmentSchema = z.object({
  phone: phoneSchema,
  patients: z.array(
    z.object({
      patientName: z.string().min(2, {
        message: "Patient name must be at least 2 characters.",
      }),
      reasonForVisit: z.enum(["Check_UP", "Revisit", "To_Meet"], {
        required_error: "Please select a reason for visit.",
      }),
    }),
  ),
  userId: z.string().optional(),
  from: z.enum(whoCreatedEnrollment).optional().nullable(),
});

// // Test cases
// const testCases = [
//   { patientName: "John Doe", reasonForVisit: "Check_UP", phone: "1234567890" }, // Should transform to +911234567890
//   {
//     patientName: "John Doe",
//     reasonForVisit: "Check_UP",
//     phone: "+916268760860",
//   }, // Already valid
//   {
//     patientName: "John Doe",
//     reasonForVisit: "Check_UP",
//     phone: "096268760860",
//   }, // Invalid
//   {
//     patientName: "John Doe",
//     reasonForVisit: "Check_UP",
//     phone: "+9106268760860",
//   }, // Should transform to +916268760860
// ];

// // Run test cases
// testCases.forEach((testCase) => {
//   const result = enrollmentSchema.safeParse(testCase);

//   console.log(`Test Case: ${JSON.stringify(testCase)}`);
//   if (!result.success) {
//     console.error(result.error.errors);
//   } else {
//     console.log(result.data); // Process the valid data
//   }
// });

export type EnrollmentSchemaT = z.infer<typeof enrollmentSchema>;

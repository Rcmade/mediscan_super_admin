import { z } from "zod";
import { phoneSchema } from ".";
import { appointmentStatusArr } from "@/constant";

export const appointmentSchema = z.object({
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  phone: phoneSchema,
  appointmentStatus: z.enum(appointmentStatusArr, {
    required_error: "Please select a status for the appointment.",
  }),
  patientName: z.string().min(2, {
    message: "User name must be at least 2 characters.",
  }),
  // reasonForVisit: z.enum(appointmentsReasons, {
  //   required_error: "Please select a reason for visit.",
  // }),
  reasonForVisitTypeId: z.string().min(2, {
    message: "Reason for visit must be at least 2 characters.",
  }),
  deletedImage: z.string().optional(),
  revisitTime: z
    .union([
      z.date(),
      z.string().datetime().or(z.string().length(0)),
      z.null(),
      z.undefined(),
    ])
    .transform((val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string" && val.trim() !== "") return new Date(val);
      return undefined; // Convert "", null, and undefined to `undefined`
    })
    .optional(),
});

export type AppointmentSchemaT = z.infer<typeof appointmentSchema>;

export const appointmentFormSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  prescriptionImage: z.instanceof(File).optional(),
  reasonForVisit: z.enum(["Check_UP", "Revisit", "To_Meet"]),
  status: z.enum(["Confirm", "Reject"]),
});

// const schema = z
//   .union([
//     z.date(),
//     z.string().datetime().or(z.string().length(0)),
//     z.null(),
//     z.undefined(),
//   ])
//   .transform((val) => {
//     if (val instanceof Date) return val;
//     if (typeof val === "string" && val.trim() !== "") return new Date(val);
//     return undefined; // Convert "", null, and undefined to `undefined`
//   })
//   .optional();
// const testCases = [
//   { input: new Date(), expected: "Valid Date" },
//   { input: "", expected: "Undefined (Empty String)" },
//   { input: null, expected: "Undefined (Null)" },
//   { input: undefined, expected: "Undefined (Undefined)" },
//   { input: "2024-02-28T12:00:00Z", expected: "Valid Date from String" },
//   { input: 1709160000000, expected: "Error (Timestamp Number not allowed)" },
//   { input: {}, expected: "Error (Invalid Object)" },
// ];

// testCases.forEach(({ input, expected }, index) => {
//   try {
//     const result = schema.parse(input);

//   } catch (error) {

//   }
// });

// // import { eq } from "drizzle-orm";
// // import { db } from "./lib/db/db"; // Drizzle database connection setup
// // import { appointments } from "./lib/db/schema"; // Your appointments table schema
// // import { format, parse } from "date-fns"; // To format and parse date strings
// // export const updateCreatedData = async () => {
// //   // Step 1: Fetch records with the 'createdAt' field for today.
// //   // Define the start of today (midnight) and the end of today (just before midnight)
// //   const todayStart = new Date();
// //   todayStart.setHours(0, 0, 0, 0); // Set to the start of today (00:00:00.000)

import { db } from "./lib/db/db";
import { organizationsWithUsersView } from "./lib/db/schema";

// import { client } from "./lib/rcp";

// //   const todayEnd = new Date();
// //   todayEnd.setHours(23, 59, 59, 999); // Set to the end of today (23:59:59.999)

// //   // Step 2: Fetch the latest appointment for today with the highest tokenNumber
// //   const b = await db.select().from(appointments);
// //   // .where(
// //   //   and(
// //   //     gte(appointments.createdAt, todayStart), // Filter for appointments after today’s midnight
// //   //     lte(appointments.createdAt, todayEnd), // Filter for appointments before tonight's midnight
// //   //   ),
// //   // )
// //   // .orderBy(desc(appointments.createdAt), desc(appointments.tokenNumber)) // Sort by createdAt and tokenNumber
// //   // .limit(1); // Limit to 1, so we only get the latest one with the highest tokenNumber

// //   // Step 3: Format the fetched records' 'createdAt' and 'updatedAt' fields to a readable format
// //   const formattedAppointments = b.map((appointment) => ({
// //     ...appointment,
// //     createdAt: format(appointment.createdAt, "yyyy-MM-dd HH:mm:ss.SSS"), // Format the createdAt date
// //     updatedAt: format(appointment.updatedAt, "yyyy-MM-dd HH:mm:ss.SSS"), // Format the updatedAt date
// //   }));


// //   // Step 4: Update the 'createdData' field (if needed) by iterating through records
// //   for (const appointment of formattedAppointments) {
// //     // Parse the existing 'createdAt' field (assuming it's in the correct format: "yyyy-MM-dd HH:mm:ss.SSS")
// //     const existingDateStr = appointment.createdAt as unknown as string; // Assuming it's a string
// //     const parsedDate = parse(
// //       existingDateStr,
// //       "yyyy-MM-dd HH:mm:ss.SSS",
// //       new Date(),
// //     ); // Parse into Date

// //     // Step 5: Adjust the time and microseconds as required
// //     // Set the time to "17:01:01" and microseconds to ".878435"
// //     const updatedDateStr =
// //       format(parsedDate, "yyyy-MM-dd") + " 17:01:01.878435";
// //     const updatedDate = parse(
// //       updatedDateStr,
// //       "yyyy-MM-dd HH:mm:ss.SSSSSS",
// //       new Date(),
// //     ); // Parse the new formatted date

// //     // Step 6: Update the record in the database with the new 'createdData' field
// //     await db
// //       .update(appointments)
// //       .set({ createdAt: updatedDate }) // Update the 'createdAt' field with the new value
// //       .where(eq(appointments.id, appointment.id));
// //     // .where(appointments.id.eq(appointment.id)); // Filter by the appointment ID


// // };

// // // Call the function to update records
// // // updateCreatedData().catch(console.error);

// const a = async () => {
//   const b = await client.api.main.admin.dashboard.stats.$get();
//   const c = await b.json();
//   console.log(c);
// };

// a();

// const b = async () => {
//   try {
//     const a = await client.api.main.schedules.$post({
//       json: {
//         startDate: "2022-02-01T00:00:00.000Z",
//         endDate: "2028-02-28T23:59:59.999Z",
//       },
//       header: {
//         "x-revisit-schedule":
//           "",
//       },
//     });
//     const b = await a.json();
//     console.log(b);
//   } catch (error) {
//     console.error(error);
//   }
// };

// b();

const a = async () => {
  const b = await db.select().from(organizationsWithUsersView);
  console.log(b);
};

a();

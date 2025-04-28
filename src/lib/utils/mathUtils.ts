// import { appointmentsReasons } from "@/constant";
import { orgAppointmentReasonsTypes, SelectAppointmentsT } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

// const pricing: {
//   id: string;
//   price: number;
//   currency: string;
//   name: (typeof appointmentsReasons)[number];
// }[] = [
//   {
//     id: "1",
//     price: 1000,
//     currency: "INR",
//     name: "Check_UP",
//   },
//   {
//     id: "2",
//     price: 2000,
//     currency: "INR",
//     name: "Revisit",
//   },
//   {
//     id: "3",
//     price: 3000,
//     currency: "INR",
//     name: "To_Meet",
//   },
// ];

// export const calculateTotalAppointmentCost = async (
//   appointments: Partial<SelectAppointmentsT>[] = [],
// ) => {
//   const orgId = appointments[0]?.organizationId;

//   const reasonTypes = await db
//     .select({
//       id: orgAppointmentReasonsTypes.id,
//       name: orgAppointmentReasonsTypes.name,
//       amount: orgAppointmentReasonsTypes.amount,
//     })
//     .from(orgAppointmentReasonsTypes)
//     .where(eq(orgAppointmentReasonsTypes.organizationId, orgId!));

//   const appointmentWithCost = appointments.map((appointment) => {
//     if (!appointment?.reasonForVisit) {
//       throw new Error("reasonForVisit is required");
//     }

//     const cost = pricing.find(
//       (item) => item.name === appointment.reasonForVisit,
//     );

//     return { cost, appointment: { ...appointment, price: cost?.price } };
//   });
//   const totalCost = appointmentWithCost.reduce(
//     (sum, item) => sum + (item.cost?.price || 0),
//     0,
//   );

//   return { appointmentWithCost, totalCost };
// };

export const calculateTotalAppointmentCost = async (
  appointments: Partial<SelectAppointmentsT>[] = [],
) => {
  const orgId = appointments[0]?.organizationId;

  if (!orgId) {
    throw new Error("organizationId is required to calculate cost");
  }

  const reasonTypes: {
    id: string;
    name: string;
    amount: string; // from DB as string (numeric type)
  }[] = await db
    .select({
      id: orgAppointmentReasonsTypes.id,
      name: orgAppointmentReasonsTypes.name,
      amount: orgAppointmentReasonsTypes.amount,
    })
    .from(orgAppointmentReasonsTypes)
    .where(eq(orgAppointmentReasonsTypes.organizationId, orgId));

  console.log({
    appointments,
  });
  const appointmentWithCost = appointments.map((appointment) => {
    if (!appointment?.reasonForVisitTypeId) {
      throw new Error("reasonForVisitTypeId is required");
    }

    const reasonType = reasonTypes.find(
      (type) => type.id === appointment.reasonForVisitTypeId,
    );

    if (!reasonType) {
      throw new Error(
        `No matching reason type found for ID ${appointment.reasonForVisitTypeId}`,
      );
    }

    const price = parseFloat(reasonType.amount); // Convert from string to number

    return {
      appointment: {
        ...appointment,
        reasonForVisit: reasonType.name,
        price,
      },
      cost: { price },
    };
  });

  const totalCost = appointmentWithCost.reduce(
    (sum, item) => sum + item.cost.price,
    0,
  );

  return { appointmentWithCost, totalCost };
};

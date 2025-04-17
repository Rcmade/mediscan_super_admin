import { appointmentsReasons } from "@/constant";
import { SelectAppointmentsT } from "../db/schema";

const pricing: {
  id: string;
  price: number;
  currency: string;
  name: (typeof appointmentsReasons)[number];
}[] = [
  {
    id: "1",
    price: 1000,
    currency: "INR",
    name: "Check_UP",
  },
  {
    id: "2",
    price: 2000,
    currency: "INR",
    name: "Revisit",
  },
  {
    id: "3",
    price: 3000,
    currency: "INR",
    name: "To_Meet",
  },
];
export const calculateTotalAppointmentCost = (
  appointments: Partial<SelectAppointmentsT>[] = [],
) => {
  const appointmentWithCost = appointments.map((appointment) => {
    if (!appointment?.reasonForVisit) {
      throw new Error("reasonForVisit is required");
    }

    const cost = pricing.find(
      (item) => item.name === appointment.reasonForVisit,
    );

    return { cost, appointment: { ...appointment, price: cost?.price } };
  });
  const totalCost = appointmentWithCost.reduce(
    (sum, item) => sum + (item.cost?.price || 0),
    0,
  );

  return { appointmentWithCost, totalCost };
};

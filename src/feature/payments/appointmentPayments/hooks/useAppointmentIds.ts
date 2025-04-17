"use client";
import { useParams } from "next/navigation";

const useAppointmentIds = () => {
  const { appointmentIds } = useParams();
  return { appointmentIds: appointmentIds as string };
};

export default useAppointmentIds;

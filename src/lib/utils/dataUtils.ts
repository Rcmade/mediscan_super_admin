import { EnrollmentSchemaT } from "@/zodSchema/enrollmentSchema";
import { AppointmentStatusT } from "../db/schema";

export const formatAppointmentData = ({
  body,
  userId,
  latestTokenNumber,
  organizationId,
}: {
  body: EnrollmentSchemaT;
  userId: string;
  organizationId: string;
  latestTokenNumber: number;
}) => {
  return body.patients.map((p, i) => ({
    patientName: p.patientName,
    reasonForVisit: p.reasonForVisit,
    appointmentStatus: "Scheduled" as AppointmentStatusT,
    tokenNumber: String(latestTokenNumber + i),
    userId,
    createdAt: new Date(),
    organizationId: organizationId,
  }));
};

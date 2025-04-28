import "server-only";
import { EnrollmentSchemaT } from "@/zodSchema/enrollmentSchema";
import { AppointmentStatusT, InsertAppointmentsT } from "../db/schema";

export const formatAppointmentData = ({
  body,
  userId,
  latestTokenNumber,
  organizationId,
  reasonTypes,
}: {
  body: EnrollmentSchemaT;
  userId: string;
  organizationId: string;
  latestTokenNumber: number;
  reasonTypes: { id: string; name: string }[];
}): InsertAppointmentsT[] => {
  return body.patients.map((p, i) => {
    const reasonType = reasonTypes.find(
      (rt) => rt.id === p.reasonForVisitTypeId,
    );

    return {
      patientName: p.patientName,
      reasonForVisitTypeId: p.reasonForVisitTypeId,
      reasonForVisit: reasonType?.name || "",
      appointmentStatus: "Scheduled" as AppointmentStatusT,
      tokenNumber: String(latestTokenNumber + i),
      userId,
      createdAt: new Date(),
      organizationId: organizationId,
    };
  });
};

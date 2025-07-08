import { Card, CardContent } from "@/components/ui/card";
import { UseSearchTokenResponseT } from "../../hook/useSearchToken";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formateReadableDateTime } from "@/lib/utils/dateUtils";
import Link from "next/link";

const EditableAppointmentCard = ({
  appointment,
  onEdit,
  webName,
}: {
  appointment: UseSearchTokenResponseT["data"][number];
  onEdit: (id: string) => void;
  webName: string;
}) => (
  <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
    <CardContent className="flex justify-between gap-2 p-2 sm:p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <h1 className="text-2xl font-semibold text-primary">
            Token: <span className="text-3xl">{appointment.tokenNumber}</span>
          </h1>
          <Badge variant={appointment.isPaid ? "default" : "destructive"}>
            {appointment.isPaid
              ? "Paid"
              : appointment.isConfirmed
                ? "Confirmed"
                : "Not Confirmed, It can only confirm by user."}
          </Badge>

          {/* {appointment.isPaid} */}
        </div>
        <h3 className="text-sm font-medium md:text-lg">
          {appointment.patientName}
        </h3>
        <p className="text-sm text-muted-foreground">ID: {appointment.id}</p>
        <Badge variant="outline" className="max-w-fit">
          {appointment.reasonForVisit}
        </Badge>
      </div>
      <div className="mb-2 flex flex-col items-end gap-2">
        <Button
          onClick={() => onEdit(appointment.id)}
          variant="ghost"
          size={"icon"}
        >
          <Edit />
        </Button>
        <Link
          href={`/admin/dashboard/organization/o/${webName}/pay/a/${appointment.id}`}
          className="flex gap-2 text-blue-500"
          target="_blank"
        >
          Payment <ExternalLink />
        </Link>

        <p className="text-sm">
          {formateReadableDateTime(appointment.createdAt)}
        </p>
        <h3 className="text-lg font-medium">{appointment.phone}</h3>

        <Badge variant="outline" className="max-w-fit">
          {appointment.appointmentStatus}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

export default EditableAppointmentCard;

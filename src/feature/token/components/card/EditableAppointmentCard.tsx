import { Card, CardContent } from "@/components/ui/card";
import { UseSearchTokenResponseT } from "../../hook/useSearchToken";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formateReadableDateTime } from "@/lib/utils/dateUtils";

const EditableAppointmentCard = ({
  appointment,
  onEdit,
}: {
  appointment: UseSearchTokenResponseT["data"][number];
  onEdit: (id: string) => void;
}) => (
  <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
    <CardContent className="flex justify-between gap-2 p-2 sm:p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">
          Token: <span className="text-3xl">{appointment.tokenNumber}</span>
        </h1>
        <h3 className="text-lg font-medium">{appointment.patientName}</h3>
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



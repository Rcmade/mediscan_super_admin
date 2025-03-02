import { Card, CardContent } from "@/components/ui/card";
import { UserGetCurrentTokenResponseT } from "@/feature/token/hook/useUserGetCurrentToken";
import { formatDateTime } from "@/lib/utils/dateUtils";

const AppointmentCard = ({
  appointment,
}: {
  appointment: UserGetCurrentTokenResponseT[number];
}) => (
  <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
    <CardContent className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-2xl font-semibold text-primary">
          Token: <span className="text-3xl">{appointment.token}</span>
        </span>
        <span className="text-sm">{formatDateTime(appointment.createdAt)}</span>
      </div>
      <h3 className="mb-1 text-lg font-medium">{appointment.patientName}</h3>
      {/* <p className="text-sm text-gray-600">ID: {appointment.id}</p> */}
    </CardContent>
  </Card>
);

export default AppointmentCard;

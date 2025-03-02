import { Download } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formateReadableDateTime } from "@/lib/utils/dateUtils";
import { getInitials } from "@/lib/utils/stringUtils";
import { HistoryResponseType } from "../../hooks/useGetUserHistory";

interface ViewHistoryCardProps {
  appointment: HistoryResponseType["appointments"][number];
  onDownload: (info: { link: string; name: string }) => void;
}
const ViewHistoryCard = ({ appointment, onDownload }: ViewHistoryCardProps) => {
  return (
    <Card key={appointment.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
          <Badge variant={appointment.reasonForVisit}>
            {appointment.reasonForVisit}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Token: {appointment.tokenNumber}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4 flex items-center gap-4">
          <Avatar
            className="h-16 w-16 border border-border"
            // onClick={() =>
            //   appointment.image &&
            //   downloadImage(appointment.image, appointment.patientName)
            // }
          >
            <AvatarImage
              src={appointment.image || undefined}
              alt={appointment.patientName}
            />
            <AvatarFallback className="text-lg">
              {getInitials(appointment.patientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            {appointment.image && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() =>
                  onDownload({
                    link: appointment.image!,
                    name: appointment.patientName,
                  })
                }
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Created: </span>
            {formateReadableDateTime(appointment.createdAt)}
          </p>
          <p>
            <span className="font-medium">Last Updated: </span>
            {formateReadableDateTime(appointment.updatedAt)}
          </p>
          {appointment.revisitTime && (
            <p>
              <span className="font-medium">Revisit: </span>
              {formateReadableDateTime(appointment.revisitTime)}
            </p>
          )}
        </div>
      </CardContent>
      {/* <CardFooter>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardFooter> */}
    </Card>
  );
};

export default ViewHistoryCard;

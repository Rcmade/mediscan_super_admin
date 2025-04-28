"use client";

import useViewAppointmentReasonType from "@/feature/appointmentReasonType/hooks/useViewAppointmentReasonType";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useAddEditAppointmentReasonsTypeDialog from "@/feature/appointmentReasonType/hooks/useAddEditAppointmentReasonTypeDialog";
import useWebName from "@/hooks/useWebName";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useDeleteAppointmentReasonType from "@/feature/appointmentReasonType/hooks/useDeleteAppointmentReasonType";

const ViewAppointmentReasonType = () => {
  const { data, isLoading } = useViewAppointmentReasonType();
  const onOpen = useAddEditAppointmentReasonsTypeDialog((s) => s.onOpen);
  const { webName } = useWebName();
  const user = useCurrentUser();
  const { handleDelete } = useDeleteAppointmentReasonType();

  if (isLoading) {
    return (
      <div className="container mx-auto py-4">
        <h1 className="mb-6 text-2xl font-bold">Appointment Reason Types</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-4 h-5 w-1/3" />
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (
    !data ||
    !data.appointmentReasons ||
    data.appointmentReasons.length === 0
  ) {
    return (
      <div className="container mx-auto py-4">
        <h1 className="mb-6 text-2xl font-bold">Appointment Reason Types</h1>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No appointment reason types found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="mb-6 text-2xl font-bold">Appointment Reason Types</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.appointmentReasons.map((reason) => (
          <Card key={reason.reasonId} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{reason.name}</CardTitle>
              <CardDescription>ID: {reason.reasonId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                Amount: <span className="text-primary">{reason.amount}</span>
              </p>
            </CardContent>
            {(user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") && (
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onOpen({ type: "edit", appointmentReason: reason, webName })
                  }
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDelete({
                      param: {
                        orgWebName: webName,
                        appointmentReasonId: reason.reasonId,
                      },
                    })
                  }
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewAppointmentReasonType;

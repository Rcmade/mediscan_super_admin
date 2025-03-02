import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AppointmentSkeleton = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mb-1 h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
};

export default AppointmentSkeleton;

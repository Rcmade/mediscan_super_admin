import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const OrgCardSkeleton = () => {
  return (
    <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="flex justify-between gap-2 p-2 sm:p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <div className="mb-2 flex flex-col items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgCardSkeleton;

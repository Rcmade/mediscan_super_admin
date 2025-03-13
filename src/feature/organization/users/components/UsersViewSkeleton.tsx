import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const UsersViewSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-[120px]" />
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <Skeleton className="h-5 w-[150px]" />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Skeleton className="h-9 w-[70px] rounded-md" />
              <Skeleton className="h-9 w-[80px] rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersViewSkeleton;

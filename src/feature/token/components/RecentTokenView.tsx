"use client";

import React from "react";
import { useUserGetCurrentToken } from "../hook/useUserGetCurrentToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppointmentCard from "@/feature/token/components/card/AppointmentCard";
import AppointmentSkeleton from "./skeleton/AppointmentSkeleton";

interface Props {
  phoneNumber: string;
}

const RecentTokenView = ({ phoneNumber }: Props) => {
  const { data, isLoading } = useUserGetCurrentToken(phoneNumber);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {isLoading ? (
            <Skeleton className="mx-auto h-12 w-3/4" />
          ) : (
            <>
              {(data || [])?.length > 0 ? (
                <div className="flex flex-col text-center">
                  <span>Thanks you for registration</span>
                  <span className="text-muted-foreground">
                    Your Token Number
                  </span>
                </div>
              ) : (
                <>
                  <p className="w-full text-center">
                    No tokens found for this phone number
                  </p>
                </>
              )}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <AppointmentSkeleton key={index} />
              ))
            : (data || [])?.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTokenView;

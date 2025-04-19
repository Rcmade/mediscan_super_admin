"use client";

import { SearchForm } from "@/feature/token/components/form/SearchForm";
import { useSearchToken } from "@/feature/token/hook/useSearchToken";
import { useSearchParams } from "next/navigation";
import { Pagination } from "./Pagination";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentSkeleton from "@/feature/token/components/skeleton/AppointmentSkeleton";
import EditableAppointmentCard from "@/feature/token/components/card/EditableAppointmentCard";
import EditAppointmentDialog from "../dialog/EditAppointmentDialog";
import { useState } from "react";
import { startOfDay } from "date-fns";
import useWebName from "@/hooks/useWebName";

const SearchAndCards = () => {
  const searchParams = useSearchParams();
  const startTime = searchParams.get("startTime");
  const endOfDay = searchParams.get("endOfDay");
  const { data, isLoading, error } = useSearchToken({
    endOfDay: endOfDay || undefined,
    limit: searchParams.get("limit") || "10",
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || undefined,
    startTime: startTime
      ? startOfDay(startTime).toISOString()
      : startOfDay(new Date()).toISOString(),
    appointmentStatus: searchParams.get("appointmentStatus") || "Scheduled",
  });
  const [editAppointmentId, setEditAppointmentId] = useState("");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const { webName } = useWebName();
  const handleEdit = (id: string) => {
    setEditAppointmentId(id);
  };

  return (
    <div className="space-y-4">
      <SearchForm />
      <EditAppointmentDialog
        appointmentId={editAppointmentId}
        setEditAppointmentId={setEditAppointmentId}
      />
      {error && <p className="text-red-500">Error: {error.message}</p>}

      <Card className="mx-auto w-full">
        <CardContent className="p-2 pt-4 md:p-6">
          {!isLoading &&
            !!!data?.data.length &&
            !endOfDay &&
            !endOfDay &&
            !startTime && <p> No Appointments Found today</p>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <AppointmentSkeleton key={index} />
                ))
              : (data?.data || [])?.map((appointment) => (
                  <EditableAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEdit}
                    webName={webName}
                  />
                ))}
          </div>
        </CardContent>
      </Card>

      {!isLoading && !error && (
        <>
          <Pagination
            page={currentPage}
            limit={limit}
            total={data?.pagination.total}
          />
        </>
      )}
    </div>
  );
};

export default SearchAndCards;

"use client";

import useGetUserHistory from "@/feature/user/hooks/useGetUserHistory";
import ViewHistoryCard from "@/feature/user/components/card/ViewHistoryCard";
import { downloadFromLink } from "@/lib/utils/downloadUtils";
import ViewHistoryCardSkeleton from "@/feature/user/components/skeleton/ViewHistoryCardSkeleton";

const HistoryClient = () => {
  const { data, isLoading } = useGetUserHistory();

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ViewHistoryCardSkeleton key={index} />
          ))}
        </div>
      ) : data?.appointments?.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.appointments.map((appointment) => (
            <ViewHistoryCard
              key={appointment.id}
              appointment={appointment}
              onDownload={downloadFromLink}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No appointment history found.
        </p>
      )}
    </>
  );
};

export default HistoryClient;

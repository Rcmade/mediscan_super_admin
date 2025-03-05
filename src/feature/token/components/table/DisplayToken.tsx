"use client";
import React from "react";
import { useGetDisplayToken } from "../../hook/useGetDisplayToken";
import { DataTable } from "./displayTokenTable/DataTable";
import { columns } from "./displayTokenTable/columns";
import TableSkeleton from "../skeleton/TableSkeleton";
import { useSearchParams } from "next/navigation";
import { formateTime } from "@/lib/utils/dateUtils";

const DisplayToken = () => {
  const searchParams = useSearchParams();
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, isLoading } = useGetDisplayToken({
    limit: limit ? limit.toString() : undefined,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="-my-4 mx-auto w-full">
      {data && data.data && data.data.length > 0 ? (
        <>
          <div className="my-4 flex justify-end">
            <span className="text-lg text-muted-foreground">
              Last Update: <strong>{formateTime(data.lastUpdated)} </strong>
            </span>
          </div>
          <DataTable columns={columns} data={data.data} />
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DisplayToken;

"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ArrowRightLeft, CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useSearchParams } from "next/navigation";
import { formatSearchDate } from "@/lib/utils/dateUtils";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

const StartEndButton = () => {
  const searchParams = useSearchParams();
  const { updateSearchParams } = useUpdateSearchParams();

  const [openPopovers, setOpenPopovers] = useState({
    startDate: false,
    endDate: false,
  });

  const endDate = searchParams.get("endDate");
  const startDate = searchParams.get("startDate");

  return (
    <div className="flex w-full items-center justify-between gap-2 md:w-auto">
      <Popover
        onOpenChange={(o) =>
          setOpenPopovers((pre) => ({ ...pre, startDate: o }))
        }
        open={openPopovers.startDate}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {startDate ? formatSearchDate(startDate) : <CalendarIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate ? new Date(startDate) : undefined}
            onSelect={(e) => {
              if (e?.toISOString()) {
                updateSearchParams({ startDate: e?.toISOString() });
                setOpenPopovers((pre) => ({ ...pre, startDate: false }));
              }
            }}
            className=""
          />
        </PopoverContent>
      </Popover>

      <ArrowRightLeft />
      <Popover
        onOpenChange={(o) => setOpenPopovers((pre) => ({ ...pre, endDate: o }))}
        open={openPopovers.endDate}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {endDate ? formatSearchDate(endDate) : <CalendarIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            onSelect={(e) => {
              if (e?.toISOString()) {
                updateSearchParams({ endDate: e?.toISOString() });
                setOpenPopovers((pre) => ({ ...pre, endDate: false }));
              }
            }}
            className=""
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StartEndButton;

"use client";
import React from "react";
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

  const endDate = searchParams.get("endDate");
  const startDate = searchParams.get("startDate");

  return (
    <div className="flex w-full items-center justify-between gap-2 md:w-auto">
      <Popover>
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
              }
            }}
            className=""
          />
        </PopoverContent>
      </Popover>

      <ArrowRightLeft />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {endDate ? formatSearchDate(endDate) : <CalendarIcon />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            // selected={endDate ? new Date(endDate) : undefined}
            // disabled={(date) => {
            //   if (startDate && isValid(startDate)) {
            //     const today = new Date();
            //     today.setHours(0, 0, 0, 0); // Reset time to start of day
            //     return (
            //       date < new Date(startDate) || // Disable dates before start date
            //       date < today ||
            //       date < new Date("1900-01-01")
            //     );
            //   }
            //   return false;
            // }}
            onSelect={(e) => {
              if (e?.toISOString()) {
                updateSearchParams({ endDate: e?.toISOString() });
              }
            }}
            className=""
          />
        </PopoverContent>
      </Popover>
      {/* <Button
        variant="ghost"
        size={"icon"}
        onClick={() => {
          //   setStartDate("");
          //   setEndDate("");
          handleSearch();
        }}
      >
        <X />
      </Button> */}
    </div>
  );
};

export default StartEndButton;

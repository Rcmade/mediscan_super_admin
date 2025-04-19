"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CalendarIcon, ArrowRightLeft, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils/dateUtils";
import Tooltip from "@/components/tooltip/Tooltip";
import Link from "next/link";
import useWebName from "@/hooks/useWebName";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentStatusArr } from "@/constant";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFormProps {
  placeholder?: string;
  isGlobalSearch?: boolean;
  showAdd?: boolean;
  showStartEnd?: boolean;
}
export function SearchForm({
  placeholder,
  isGlobalSearch = false,
  showAdd = true,
  showStartEnd = true,
}: SearchFormProps) {
  const searchParams = useSearchParams();
  const { webName } = useWebName();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [startTime, setStartTime] = useState(
    searchParams.get("startTime") ||
      (isGlobalSearch ? undefined : new Date().toISOString()),
  );
  const [appointmentStatus, setAppointmentStatus] = useState(
    searchParams.get("appointmentStatus") || "Scheduled",
  );
  const submitRef = useRef<HTMLButtonElement>(null);

  const [endOfDay, setEndOfDay] = useState(
    searchParams.get("endOfDay") || (isGlobalSearch ? undefined : ""),
  );
  const router = useRouter();

  const handleSearch = () => {
    submitRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search || "");
    if (startTime) searchParams.set("startTime", startTime || "");
    if (endOfDay) searchParams.set("endOfDay", endOfDay || "");
    if (appointmentStatus)
      searchParams.set("appointmentStatus", appointmentStatus);
    router.push(`?${searchParams.toString()}` || "");
  };

  const debounceSearch = useDebounce(handleSearch, 500);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2 md:flex-row"
    >
      <div className="flex w-full items-center justify-between gap-2 md:flex-1">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder || "Search appointments, number, token..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceSearch();
            }}
            className="pl-10 pr-20"
          />

          <Button
            type="submit"
            variant="ghost"
            className="absolute right-0 top-0"
            ref={submitRef}
          >
            <span>Search</span>
          </Button>
        </div>
        {showAdd && (
          <div>
            <Tooltip content="Add new appointment">
              <Button>
                <Link href={`/o/${webName}/admin/enroll`}>Add</Link>
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
      {showStartEnd && (
        <div className="flex w-full items-center justify-between gap-2 md:w-auto">
          <Select
            onValueChange={(e) => {
              setAppointmentStatus(e);
              setTimeout(() => {
                handleSearch();
              }, 0);
            }}
            defaultValue={appointmentStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              {appointmentStatusArr.map((status) => (
                <SelectItem value={status} key={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-1 items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  {startTime ? formatDate(startTime) : <CalendarIcon />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startTime ? new Date(startTime) : undefined}
                  onSelect={(e) => {
                    setStartTime(e?.toISOString() || "");
                    setTimeout(() => {
                      handleSearch();
                    }, 0);
                  }}
                  className=""
                />
              </PopoverContent>
            </Popover>

            <ArrowRightLeft />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  {endOfDay ? formatDate(endOfDay) : <CalendarIcon />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endOfDay ? new Date(endOfDay) : undefined}
                  onSelect={(e) => {
                    setEndOfDay(e?.toISOString() || "");
                    setTimeout(() => {
                      handleSearch();
                    }, 0);
                  }}
                  className=""
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="ghost"
            size={"icon"}
            onClick={() => {
              setStartTime("");
              setEndOfDay("");
              handleSearch();
            }}
          >
            <X />
          </Button>
        </div>
      )}
    </form>
  );
}

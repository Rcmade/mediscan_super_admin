"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import useViewDueTransaction, {
  TransactionRequestType,
} from "@/feature/transaction/hooks/useViewTransaction";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import {
  transactionSortByArr,
  transactionSortOrderArr,
} from "@/content/transactionContent";
import useTable from "@/hooks/useTable";
import useViewAdminTransactionColumns from "@/feature/transaction/hooks/useViewAdminTransactionColumns";
import ResponsiveTable from "@/components/table/ResponsiveTable";
import PaginationButtons from "@/components/buttons/PaginationButtons";

export default function ClientComponent() {
  const searchParams = useSearchParams();

  const { updateSearchParams } = useUpdateSearchParams();
  const { data } = useViewDueTransaction();

  const [filters, setFilters] = useState<TransactionRequestType["query"]>({
    search: searchParams.get("search") || "",
    fromDate: searchParams.get("fromDate")
      ? new Date(searchParams.get("fromDate") || "").toISOString()
      : undefined,
    toDate: searchParams.get("toDate")
      ? new Date(searchParams.get("toDate") || "").toISOString()
      : undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: searchParams.get("page") || "1",
  });


  const [openPopovers, setOpenPopovers] = useState({
    fromDate: false,
    toDate: false,
  });

  const handleUpdateSearchParams = (
    data: Partial<TransactionRequestType["query"]>,
  ) => {
    updateSearchParams(data);
  };
  const debounceSearch = useDebounce(handleUpdateSearchParams, 500);

  const { columns } = useViewAdminTransactionColumns();
  const { table, pageSize } = useTable({
    columns,
    count: data?.pagination.total || 0,
    results: data?.data || [],
  });

  const totalPages = Math.ceil((data?.pagination?.total || 0) / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    debounceSearch(filters);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter transactions by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search by Org name</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, search: e.target.value }));
                    // debounceSearch({ search: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover
                onOpenChange={(o) =>
                  setOpenPopovers((pre) => ({ ...pre, fromDate: o }))
                }
                open={openPopovers.fromDate}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-input text-left font-normal",
                      !filters.fromDate && "text-muted-foreground",
                    )}
                    onClick={() => {
                      setOpenPopovers((pre) => ({ ...pre, fromDate: true }));
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate
                      ? format(filters.fromDate as string, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.fromDate
                        ? new Date(filters.fromDate as string)
                        : undefined
                    }
                    onSelect={(e) => {
                      if (e?.toISOString())
                        setFilters((prev) => ({
                          ...prev,
                          fromDate: e?.toISOString(),
                        }));
                      // debounceSearch({ fromDate: e?.toISOString() });
                      setTimeout(() => {
                        setOpenPopovers((pre) => ({ ...pre, fromDate: false }));
                      }, 0);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>

              <Popover
                onOpenChange={(o) =>
                  setOpenPopovers((pre) => ({ ...pre, toDate: o }))
                }
                open={openPopovers.toDate}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-input text-left font-normal",
                      !filters.toDate && "text-muted-foreground",
                    )}
                    onClick={() => {
                      setOpenPopovers((pre) => ({ ...pre, toDate: true }));
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.toDate
                      ? format(filters.toDate as string, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      filters.toDate
                        ? new Date(filters.toDate as string)
                        : undefined
                    }
                    onSelect={(e) => {
                      if (e?.toISOString())
                        setFilters((prev) => ({
                          ...prev,
                          toDate: e?.toISOString(),
                        }));
                      // handleUpdateSearchParams({ toDate: e?.toISOString() });
                      setTimeout(() => {
                        setOpenPopovers((pre) => ({ ...pre, toDate: false }));
                      }, 0);
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const fromDate = filters.fromDate
                        ? new Date(filters.fromDate as string)
                        : undefined;

                      return (
                        (fromDate && date < fromDate) ||
                        date < today ||
                        date < new Date("1900-01-01")
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={filters.sortBy as string}
                onValueChange={(e) => {
                  setFilters((prev) => ({ ...prev, sortBy: e }));
                  // handleUpdateSearchParams({ sortBy: e });
                }}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {transactionSortByArr.map((arr) => (
                    <SelectItem className="capitalize" key={arr} value={arr}>
                      {arr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex gap-2">
                {transactionSortOrderArr.map((arr) => (
                  <Button
                    key={arr}
                    variant={filters.sortOrder === arr ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, sortOrder: arr }));
                      // handleUpdateSearchParams({ sortOrder: arr });
                    }}
                    className="flex-1 capitalize"
                  >
                    {arr}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ResponsiveTable table={table} columns={columns} />
      <PaginationButtons
        pageSize={pageSize}
        count={data?.pagination?.total || 0}
        pageNumbers={pageNumbers}
        totalPages={totalPages}
      />
    </div>
  );
}

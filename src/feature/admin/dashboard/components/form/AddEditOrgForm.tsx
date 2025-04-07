"use client";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useAddEditOrgForm from "../../hooks/useAddEditOrgForm";
import { useEffect, useState } from "react";
import { NumberInput } from "@/components/ui/number-input";
import { formatDate } from "@/lib/utils/dateUtils";

export default function AddEditOrgForm() {
  const {
    form,
    handleSubmit,
    isLoading,
    orgInfo,
    startDate,
    transaction,
    transactionId,
  } = useAddEditOrgForm();
  const [openPopovers, setOpenPopovers] = useState({
    startDate: false,
    endDate: false,
  });

  const paidAmount = form.watch("transaction.paid");
  const totalAmount = form.watch("transaction.total");
  useEffect(() => {
    if (paidAmount === undefined || totalAmount === undefined) return;
    if (paidAmount >= totalAmount) return;
    form.setValue("transaction.due", totalAmount - paidAmount);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidAmount, totalAmount]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Dr. John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorWebName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Web Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="dr-john-doe"
                  {...field}
                />
              </FormControl>
              <FormDescription>This will be used in the URL</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceStartDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service Start Date</FormLabel>
              <Popover
                open={openPopovers.startDate}
                onOpenChange={(o) =>
                  setOpenPopovers((pre) => ({ ...pre, startDate: o }))
                }
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full border-input pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}

                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    // onSelect={field.onChange}
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpenPopovers((pre) => ({ ...pre, startDate: false }));
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time to start of day
                      return date < today || date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
              <FormDescription>
                The first day when services started.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceEndDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service End Date</FormLabel>
              <Popover
                open={openPopovers.endDate}
                onOpenChange={(o) =>
                  setOpenPopovers((pre) => ({ ...pre, endDate: o }))
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full border-input pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                    // Disable the end date button if start date isn't selected
                    disabled={!startDate || isLoading}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>
                        {!startDate ? "Select start date first" : "Pick a date"}
                      </span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setOpenPopovers((pre) => ({ ...pre, endDate: false }));
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time to start of day
                      return (
                        date < startDate || // Disable dates before start date
                        date < today ||
                        date < new Date("1900-01-01")
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
              <FormDescription>
                The last day when services were provided.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Limit</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  onWheel={(e) => (e.target as HTMLInputElement)?.blur()}
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormDescription>Maximum number of users allowed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  readOnly={orgInfo?.type === "edit"}
                  onChange={(e) => {
                    if (orgInfo?.type === "edit") return;
                    onChange(e.target.value);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {orgInfo?.type === "edit" && (
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>
              {transaction?.createdAt
                ? `This transaction was created on ${formatDate(transaction?.createdAt)}`
                : ""}
              {transaction?.updatedAt
                ? ` and updated on ${formatDate(transaction?.updatedAt)}`
                : ""}
              To create new transaction, please click on new transaction button
            </span>
            <Button
              variant={transactionId ? "outline" : "default"}
              onClick={() => {
                form.setValue(
                  "transaction.transactionId",
                  transactionId ? undefined : transaction?.id,
                );
              }}
              size="sm"
              type="button"
              disabled={isLoading}
            >
              {transactionId ? "New Transaction" : "Update Transaction"}
            </Button>

            <span>
              {transactionId ? (
                <span>
                  This transaction will be <strong> updated </strong> when you
                  submit the form
                </span>
              ) : (
                <span>
                  `This is a new transaction, it will be
                  <strong> created </strong> when you submit the form`
                </span>
              )}
            </span>
          </div>
        )}
        <FormField
          control={form.control}
          name="transaction.total"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <NumberInput
                  value={value}
                  onValueChange={(e) => onChange(e)}
                  {...rest}
                />
              </FormControl>
              <FormDescription>
                The total amount of the transaction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transaction.paid"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Paid Amount</FormLabel>
              <FormControl>
                <NumberInput
                  value={value}
                  onValueChange={(e) => {
                    onChange(e);
                  }}
                  {...rest}
                />
              </FormControl>
              <FormDescription>The amount that has been paid</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transaction.due"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Due Amount</FormLabel>
              <FormControl>
                <NumberInput
                  value={value}
                  onValueChange={(e) => onChange(e)}
                  {...rest}
                />
              </FormControl>
              <FormDescription>The amount that is due</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" spinner disabled={isLoading}>
          {orgInfo?.type === "create"
            ? "Create Organization"
            : "Update Organization"}
        </Button>
      </form>
    </Form>
  );
}

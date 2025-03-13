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

export default function AddEditOrgForm() {
  const { form, handleSubmit, isLoading, orgInfo, startDate } =
    useAddEditOrgForm();

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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                    onSelect={field.onChange}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
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
                    onSelect={field.onChange}
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

        <FormField
          control={form.control}
          name="transaction.total"
          render={({ field: { ...rest } }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="number"
                  // min="1"
                  {...rest}
                  onChange={(e) => rest.onChange(e.target.valueAsNumber || 0)}
                  // value={value}
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
          render={({ field: { ...rest } }) => (
            <FormItem>
              <FormLabel>Paid Amount</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="number"
                  // min="1"
                  // value={value}
                  {...rest}
                  onChange={(e) => rest.onChange(e.target.valueAsNumber || 0)}
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
          render={({ field: { ...rest } }) => (
            <FormItem>
              <FormLabel>Due Amount</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="number"
                  // min="1"
                  {...rest}
                  onChange={(e) => rest.onChange(e.target.valueAsNumber || 0)}
                  // value={value}
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

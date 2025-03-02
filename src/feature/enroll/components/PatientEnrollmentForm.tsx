"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEnrollForm } from "../hooks/useEnrollForm";
import { EnrollmentSchemaT } from "@/zodSchema/enrollmentSchema";
import { useFieldArray } from "react-hook-form";
import { PlusCircle, X } from "lucide-react";
import { EnrollmentReasonT, UserRole } from "@/lib/db/schema";
import { appointmentsReasons } from "@/constant";
import { Separator } from "@/components/ui/separator";

interface PatientEnrollmentFormProps {
  defaultValue?: EnrollmentSchemaT;
  // Who is created this appointment receptionist or admin or not normal user.
  from?: UserRole;
}
export function PatientEnrollmentForm({
  defaultValue,
  from,
}: PatientEnrollmentFormProps) {
  const { form, onSubmit, isLoading } = useEnrollForm(defaultValue, from);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "patients",
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    disabled={isLoading}
                    placeholder="1234567890"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                {index > 0 && (
                  <h3 className="text-lg font-semibold">Patient {index + 1}</h3>
                )}
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove patient</span>
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`patients.${index}.patientName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        autoComplete="name"
                        placeholder="Enter Name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the full name of the patient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`patients.${index}.reasonForVisit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isLoading}>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentsReasons.map((reason) => (
                          <SelectItem value={reason} key={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the primary reason for the patient&apos;s visit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="bg-primary" />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              append({
                patientName: "",
                reasonForVisit: "" as EnrollmentReasonT,
              })
            }
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Patient
          </Button>

          <Button disabled={isLoading} spinner type="submit">
            Submit Enrollment
          </Button>
        </form>
      </Form>
    </>
  );
}

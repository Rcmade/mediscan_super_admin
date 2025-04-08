"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { useGetAppointment } from "../../hook/useGetAppointment";
import { DialogTitle } from "@radix-ui/react-dialog";
import EditAppointmentForm from "../form/EditAppointmentForm";
import { appointmentFormSchema } from "@/zodSchema/appointmentSchema";

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface EditAppointmentDialogProps {
  appointmentId?: string;
  setEditAppointmentId: (value: React.SetStateAction<string>) => void;
}

export default function EditAppointmentDialog({
  appointmentId,
  setEditAppointmentId,
}: EditAppointmentDialogProps) {
  const { data, isLoading } = useGetAppointment(appointmentId);

  return (
    <Dialog
      open={!!appointmentId}
      onOpenChange={() => setEditAppointmentId("")}
    >
      <DialogContent
        onInteractOutside={(e) => e?.preventDefault()}
        className="sm:max-w-md"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="text-4xl font-bold">
            <DialogTitle>
              {isLoading ? (
                <Skeleton className="h-12 w-12" />
              ) : (
                data?.tokenNumber
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {appointmentId}
            </DialogDescription>
          </div>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <EditAppointmentForm
            data={{
              ...data,
              patientName: data?.patientName || "",
              tokenNumber: data?.tokenNumber || "",
              appointmentStatus: data?.appointmentStatus || "Scheduled",
              image: data?.image || null,
              phone: data?.phone || null,
              reasonForVisit: data?.reasonForVisit || "Check_UP",
              createdAt: data?.createdAt || "",
              id: data?.id || "",
              revisitTime: data?.revisitTime || null,
            }}
            setEditAppointmentId={() => setEditAppointmentId("")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";
import React from "react";
import useAddEditAppointmentReasonsTypeDialog from "../../hooks/useAddEditAppointmentReasonTypeDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEditAppointmentReasonTypeForm from "../form/AddEditAppointmentReasonTypeForm";

const AddEditAppointmentReasonTypeDialog = () => {
  const { isOpen, onClose, appointmentReason } =
    useAddEditAppointmentReasonsTypeDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {appointmentReason?.type === "edit"
              ? "Edit Appointment Reason Type"
              : "Add Appointment Reason Type"}
          </DialogTitle>
          <DialogDescription>
            {appointmentReason?.type === "edit"
              ? "Are you sure you want to edit this appointment reason type?"
              : "Fill in the details to add a new appointment reason type."}
          </DialogDescription>
        </DialogHeader>
        <AddEditAppointmentReasonTypeForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAppointmentReasonTypeDialog;

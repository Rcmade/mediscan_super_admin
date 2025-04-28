import AddAppointmentReasonsType from "@/feature/appointmentReasonType/components/button/AddAppointmentReasonTypeButton";
import AddEditAppointmentReasonTypeDialog from "@/feature/appointmentReasonType/components/dialog/AddEditAppointmentReasonTypeDialog";
import React from "react";
import ViewAppointmentReasonType from "./_ViewAppointmentReasonType";

const page = () => {
  return (
    <>
      <AddEditAppointmentReasonTypeDialog />
      <div className="flex w-full justify-end">
        <AddAppointmentReasonsType />
      </div>
      <ViewAppointmentReasonType />
    </>
  );
};

export default page;

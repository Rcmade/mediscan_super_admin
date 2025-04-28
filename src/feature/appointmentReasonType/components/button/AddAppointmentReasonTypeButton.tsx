"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import useWebName from "@/hooks/useWebName";
import useAddEditAppointmentReasonTypeDialog from "../../hooks/useAddEditAppointmentReasonTypeDialog";

const AddAppointmentReasonTypeButton = () => {
  const { webName } = useWebName();

  const onOpen = useAddEditAppointmentReasonTypeDialog((s) => s.onOpen);

  return (
    <Button onClick={() => onOpen({ type: "create", webName })}>Add new</Button>
  );
};

export default AddAppointmentReasonTypeButton;

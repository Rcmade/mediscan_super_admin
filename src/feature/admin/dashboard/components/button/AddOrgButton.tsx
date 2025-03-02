"use client";
import React from "react";
import { useAddEditOrgDialog } from "../../hooks/useAddEditOrgDialog";
import { Button } from "@/components/ui/button";

const AddOrgButton = () => {
  const onOpen = useAddEditOrgDialog((s) => s.onOpen);
  return (
    <Button onClick={() => onOpen({ type: "create" })} variant="outline">
      Add org
    </Button>
  );
};

export default AddOrgButton;

"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import useAddEditTransactionDialog from "../../hooks/useAddEditTransactionDialog";

const AddNewOrgTransactionButton = ({ webName }: { webName: string }) => {
  const onOpen = useAddEditTransactionDialog((s) => s.onOpen);
  return (
    <Button
      onClick={() =>
        onOpen({ type: "create", webName })
      }
    >
      + Add new
    </Button>
  );
};

export default AddNewOrgTransactionButton;

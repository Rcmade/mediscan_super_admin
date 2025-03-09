"use client";
import React from "react";
import { useAddEditOrgUserDialog } from "../../hooks/useAddEditOrgUserDialog";
import { Button } from "@/components/ui/button";
import useWebName from "@/hooks/useWebName";

const AddOrgUserButton = () => {
  const onOpen = useAddEditOrgUserDialog((s) => s.onOpen);
  const { webName } = useWebName();

  return (
    <Button
      onClick={() => onOpen({ type: "create", orgUserInfo: { webName } })}
    >
      Add User
    </Button>
  );
};

export default AddOrgUserButton;

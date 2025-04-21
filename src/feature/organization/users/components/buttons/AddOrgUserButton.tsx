"use client";
import React from "react";
import { useAddEditOrgUserDialog } from "../../hooks/useAddEditOrgUserDialog";
import { Button } from "@/components/ui/button";
import useWebName from "@/hooks/useWebName";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AddOrgUserButton = () => {
  const onOpen = useAddEditOrgUserDialog((s) => s.onOpen);
  const { webName } = useWebName();
  const user = useCurrentUser();
  return (
    <>
      {user?.role === "ADMIN" ||
        (user?.role === "SUPER_ADMIN" && (
          <Button
            onClick={() => onOpen({ type: "create", orgUserInfo: { webName } })}
          >
            Add User
          </Button>
        ))}
    </>
  );
};

export default AddOrgUserButton;

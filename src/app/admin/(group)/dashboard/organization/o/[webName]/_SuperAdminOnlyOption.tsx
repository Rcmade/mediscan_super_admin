"use client";
import DeleteOrgButton from "@/feature/organization/components/buttons/DeleteOrgButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";

const SuperAdminOnlyOption = () => {
  const user = useCurrentUser();

  if (!user || !user.id || user?.role !== "SUPER_ADMIN") return null;

  return (
    <div className="mb-4 flex items-center justify-end">
      <DeleteOrgButton />
    </div>
  );
};

export default SuperAdminOnlyOption;

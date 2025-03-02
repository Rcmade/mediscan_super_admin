"use client";
import dynamic from "next/dynamic";
import React from "react";
const AddEditOrgDialog = dynamic(
  () => import("@/feature/admin/dashboard/components/dialog/AddEditOrgDialog"),
  { ssr: false },
);

const ClientComponents = () => {
  return (
    <>
      <AddEditOrgDialog />
    </>
  );
};

export default ClientComponents;

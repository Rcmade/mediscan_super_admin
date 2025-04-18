// "use client";
import React from "react";
// import { useAddEditOrgDialog } from "../../hooks/useAddEditOrgDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AddOrgButton = () => {
  // const onOpen = useAddEditOrgDialog((s) => s.onOpen);
  return (
    // <Button onClick={() => onOpen({ type: "create" })} variant="outline">
    //   Add org
    // </Button>
    <Button asChild>
      <Link href="/admin/dashboard/organization/add">Add org</Link>
    </Button>
  );
};

export default AddOrgButton;

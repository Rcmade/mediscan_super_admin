"use client";
import React, { Suspense } from "react";
import { useGetOrgDetailsByWebName } from "../../hooks/useGetOrgByWebName";

const UserTypeSuspense = () => {
  const { data: orgDetails, isLoading } = useGetOrgDetailsByWebName();

  const userType = orgDetails?.orgType === "HOSPITAL" ? "Patient" : "Customer";

  if (!orgDetails || isLoading) return null;

  return <span className="capitalize"> {userType}</span>;
};

const UserType = () => {
  return (
    <Suspense>
      <UserTypeSuspense />
    </Suspense>
  );
};

export default UserType;

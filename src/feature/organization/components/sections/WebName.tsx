"use client";
import React, { Suspense } from "react";
import { useGetOrgDetailsByWebName } from "../../hooks/useGetOrgByWebName";

const WebNameSuspense = () => {
  const { data, isLoading } = useGetOrgDetailsByWebName();

  if (!data || isLoading) return null;
  return <span className="capitalize"> {data?.doctorWebName}</span>;
};

const WebName = () => {
  return (
    <Suspense>
      <WebNameSuspense />
    </Suspense>
  );
};

export default WebName;

// "use client";
// import React from "react";
// import { useGetOrgDetailsByWebName } from "../../hooks/useGetOrgByWebName";

// const Description = () => {
//   const { data } = useGetOrgDetailsByWebName();
//   return <p>{data?.description}</p>;
// };

// export default Description;

"use client";
import React, { Suspense } from "react";
import { useGetOrgDetailsByWebName } from "../../hooks/useGetOrgByWebName";

const DescriptionSuspense = () => {
  const { data, isLoading } = useGetOrgDetailsByWebName();

  if (!data || isLoading) return null;
  return <span className="text-base capitalize"> {data?.description}</span>;
};

const Description = () => {
  return (
    <Suspense>
      <DescriptionSuspense />
    </Suspense>
  );
};

export default Description;

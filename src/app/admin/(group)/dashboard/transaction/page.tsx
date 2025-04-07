import React, { Suspense } from "react";
import ClientComponent from "./_ClientComponent";

// export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense>
      <ClientComponent />
    </Suspense>
  );
};

export default page;

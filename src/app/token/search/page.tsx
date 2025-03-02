import { currentUser } from "@/action/currentUser";
import SearchAndCards from "@/feature/token/components/search/SearchAndCards";
import React, { Suspense } from "react";

const page = async () => {
  const user = await currentUser();
  if (!user || (user?.role !== "ADMIN" && user?.role !== "RECEPTIONIST")) {
    return <div>Not Authorized</div>;
  }
  return (
    <Suspense>
      <SearchAndCards />
    </Suspense>
  );
};

export default page;

import { currentUser } from "@/action/currentUser";
import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import SearchAndCards from "@/feature/token/components/search/SearchAndCards";
import React, { Suspense } from "react";

const page = async () => {
  const user = await currentUser();
  if (
    !user ||
    (user?.role !== "ADMIN" &&
      user?.role !== "RECEPTIONIST" &&
      user.role !== "SUPER_ADMIN")
  ) {
    return <div>Not Authorized</div>;
  }
  return (
    <Suspense>
      <SubscriptionPopupAlert />

      <SearchAndCards />
    </Suspense>
  );
};

export default page;

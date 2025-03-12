import { currentUser } from "@/action/currentUser";
import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import AddOrgButton from "@/feature/admin/dashboard/components/button/AddOrgButton";
import SearchAndViewOrg from "@/feature/organization/components/sections/SearchAndViewOrg";
import React from "react";

const page = async () => {
  const user = await currentUser();
  // if (user?.role === "RECEPTIONIST" || user?.role === "ADMIN") {
  // }

  if (user?.role !== "SUPER_ADMIN") {
    return <div>Unauthorized</div>;
  }
  return (
    <div>
      <SubscriptionPopupAlert />
      <div className="my-4 flex w-full justify-end">
        <AddOrgButton />
      </div>
      <SearchAndViewOrg />
    </div>
  );
};

export default page;

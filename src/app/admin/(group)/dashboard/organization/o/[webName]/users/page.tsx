import React from "react";
import ViewUsers from "./_ViewUsers";
import AddOrgUserButton from "@/feature/organization/users/components/buttons/AddOrgUserButton";
import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import Title from "@/feature/organization/components/sections/Title";

const Page = () => {
  return (
    <div className="space-y-6">
      <Title />

      <SubscriptionPopupAlert />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Organization Users
          </h2>
          <p className="text-muted-foreground">
            Manage users in your organization
          </p>
        </div>
        <AddOrgUserButton />
      </div>

      <ViewUsers />
    </div>
  );
};

export default Page;

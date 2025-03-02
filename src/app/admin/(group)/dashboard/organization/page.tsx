import AddOrgButton from "@/feature/admin/dashboard/components/button/AddOrgButton";
import SearchAndViewOrg from "@/feature/organization/components/sections/SearchAndViewOrg";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="my-4 flex w-full justify-end">
        <AddOrgButton />
      </div>
      <SearchAndViewOrg />
    </div>
  );
};

export default page;

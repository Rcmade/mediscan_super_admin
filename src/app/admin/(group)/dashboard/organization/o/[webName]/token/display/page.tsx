import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import Title from "@/feature/organization/components/sections/Title";
import DisplayToken from "@/feature/token/components/table/DisplayToken";
import React from "react";

const DisplayTokenPage = () => {
  return (
    <>
      <Title />

      <SubscriptionPopupAlert />
      <DisplayToken />
    </>
  );
};

export default DisplayTokenPage;

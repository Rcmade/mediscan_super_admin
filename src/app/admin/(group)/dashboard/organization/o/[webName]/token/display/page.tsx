import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import DisplayToken from "@/feature/token/components/table/DisplayToken";
import React from "react";

const DisplayTokenPage = () => {
  return (
    <>
      <SubscriptionPopupAlert />
      <DisplayToken />;
    </>
  );
};

export default DisplayTokenPage;

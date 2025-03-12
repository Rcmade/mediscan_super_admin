import SubscriptionPopupAlert from "@/components/alerts/SubscriptionPopupAlert";
import QrCodeDisplay from "@/feature/organization/overview/components/section/QrCodeDisplay";
import { PagePropsPromise } from "@/types";
import React from "react";

const page = async ({ params }: PagePropsPromise) => {
  const webName = (await params).webName;
  const enrollPath = `${process.env.NEXT_PUBLIC_URL}/o/${webName}/enroll`;

  return (
    <div className="size-96">
      <SubscriptionPopupAlert />
      <QrCodeDisplay
        value={enrollPath}
        title="Scan to Enroll"
        webName={webName}
      />
    </div>
  );
};

export default page;

import React from "react";
import RecentTokenView from "@/feature/token/components/RecentTokenView";
import { PagePropsPromise } from "@/types";

const page = async ({ params }: PagePropsPromise) => {
  const { phoneId } = await params;

  return (
    <div>
      <RecentTokenView phoneNumber={phoneId} />
    </div>
  );
};

export default page;

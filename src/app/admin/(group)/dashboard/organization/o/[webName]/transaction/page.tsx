import { PagePropsPromise } from "@/types";
import React from "react";
import AddNewOrgTransactionButton from "@/feature/transaction/components/buttons/AddNewOrgTransactionButton";
import OrgPaymentClientComponent from "@/app/admin/(group)/dashboard/transactions/_OrgPaymentClientComponent";
import AddEditTransactionDialog from "@/feature/transaction/components/dialog/AddEditTransactionDialog";

const page = async ({ params }: PagePropsPromise) => {
  const awaitedParams = await params;
  const { webName } = awaitedParams;
  return (
    <OrgPaymentClientComponent doctorWebName={decodeURIComponent(webName)}>
      <AddNewOrgTransactionButton webName={decodeURIComponent(webName)} />
      <AddEditTransactionDialog />
    </OrgPaymentClientComponent>
  );
};

export default page;

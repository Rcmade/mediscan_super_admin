import { PagePropsPromise } from "@/types";
import React from "react";
import AddNewOrgTransactionButton from "@/feature/transaction/components/buttons/AddNewOrgTransactionButton";
import OrgPaymentClientComponent from "@/app/admin/(group)/dashboard/transactions/_OrgPaymentClientComponent";
import AddEditTransactionDialog from "@/feature/transaction/components/dialog/AddEditTransactionDialog";
import { currentUser } from "@/action/currentUser";

const page = async ({ params }: PagePropsPromise) => {
  const awaitedParams = await params;
  const { webName } = awaitedParams;
  const user = await currentUser();
  return (
    <OrgPaymentClientComponent doctorWebName={decodeURIComponent(webName)}>
      {user?.role === "SUPER_ADMIN" && (
        <AddNewOrgTransactionButton webName={decodeURIComponent(webName)} />
      )}
      <AddEditTransactionDialog />
    </OrgPaymentClientComponent>
  );
};

export default page;

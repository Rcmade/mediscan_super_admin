import React, { Suspense } from "react";
import OrgPaymentClientComponent from "./_OrgPaymentClientComponent";
import AddEditTransactionDialog from "@/feature/transaction/components/dialog/AddEditTransactionDialog";

// export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense>
      <AddEditTransactionDialog />
      <OrgPaymentClientComponent />
    </Suspense>
  );
};

export default page;

import { PagePropsPromise } from "@/types";
import React from "react";
// import AddEditTransactionDialog from "@/feature/transaction/components/dialog/AddEditTransactionDialog";
import AppointmentPaymentClientComponent from "./_AppointmentPaymentClientComponent";

const page = async ({}: PagePropsPromise) => {
  // const awaitedParams = await params;
  // const { webName } = awaitedParams;
  return (
    <AppointmentPaymentClientComponent>
      {/* <AddEditTransactionDialog /> */}
    </AppointmentPaymentClientComponent>
  );
};

export default page;

import { PagePropsPromise } from "@/types";
import React, { Suspense } from "react";
// import AddEditTransactionDialog from "@/feature/transaction/components/dialog/AddEditTransactionDialog";
import AppointmentPaymentClientComponent from "./_AppointmentPaymentClientComponent";
import PaymentDashboardContent from "../payment-overview/PaymentDashboardContent";
import Title from "@/feature/organization/components/sections/Title";

const page = async ({}: PagePropsPromise) => {
  // const awaitedParams = await params;
  // const { webName } = awaitedParams;
  return (
    <>
      <Title />
      <AppointmentPaymentClientComponent
        paymentOverviewChildren={
          <>
            <Suspense>
              <PaymentDashboardContent isOverviewOnly="true" />
            </Suspense>
          </>
        }
      >
        {/* <AddEditTransactionDialog /> */}
      </AppointmentPaymentClientComponent>
    </>
  );
};

export default page;

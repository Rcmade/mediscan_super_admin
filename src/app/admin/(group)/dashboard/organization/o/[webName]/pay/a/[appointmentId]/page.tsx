import { currentUser } from "@/action/currentUser";
import CompletePaymentOverviewSection from "@/app/o/[webName]/enroll/pay/[appointmentIds]/success/[paymentId]/_CompletePaymentOverviewSection";
import ReceptionistPaymentConfirmationSection from "@/feature/payments/appointmentPayments/components/sections/ReceptionistPaymentConfirmationSection";
import { client } from "@/lib/rpc";
import { PagePropsPromise } from "@/types";
import { InferRequestType } from "hono";
import React, { Suspense } from "react";

const api =
  client.api.main.payments.appointment.view["a"][":appointmentId"]["$get"];

const getOrderInfo = async (input: InferRequestType<typeof api>) => {
  try {
    const res = await api(input);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching order info:", error);
    return null;
  }
};

const page = async ({ params }: PagePropsPromise) => {
  const awaitedParams = await params;
  const user = await currentUser();
  if (!user || !user?.id) {
    return <div>Unauthorized</div>;
  }

  const appointmentId = awaitedParams?.appointmentId;

  const paymentData = await getOrderInfo({
    param: {
      // userId: user.id,
      appointmentId: appointmentId,
    },
  });

  if (!paymentData || !paymentData?.data) {
    return <div>Payment not found</div>;
  }
  return (
    <>
      <CompletePaymentOverviewSection paymentData={paymentData}>
        <Suspense>
          <ReceptionistPaymentConfirmationSection paymentInfo={paymentData} />
        </Suspense>
      </CompletePaymentOverviewSection>
    </>
  );
};
export default page;

import { PagePropsPromise } from "@/types";
import React from "react";
import { currentUser } from "@/action/currentUser";
import { client } from "@/lib/rpc";
import { InferRequestType } from "hono";
import CompletePaymentOverviewSection from "./_CompletePaymentOverviewSection";

const api =
  client.api.main.payments.appointment.view.u[":userId"]["o"][":paymentId"][
    "$get"
  ];

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

  const paymentId = awaitedParams?.paymentId;
  const paymentData = await getOrderInfo({
    param: {
      userId: user.id,
      paymentId,
    },
  });

  if (!paymentData) {
    return <div>Payment not found</div>;
  }

  return (
    <>
      <CompletePaymentOverviewSection paymentData={paymentData} />
    </>
  );
};

export default page;

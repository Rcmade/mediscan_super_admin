"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import React from "react";
import { APPOINTMENT_ID_HASH_NAME, paymentMethodsArr } from "@/constant";
import useInitiateAppointmentPayment from "../../hooks/useInitiateAppointmentPayment";

interface PaymentTabsSectionProps {
  paymentInfo: InferResponseType<
    (typeof client.api.main.enroll)[":webName"]["payment-overview"]["$post"],
    200
  >;
  appointmentIds: string;
}
const PaymentTabsSection: React.FC<PaymentTabsSectionProps> = ({
  paymentInfo,
  appointmentIds,
}) => {
  const { mutate, isLoading } = useInitiateAppointmentPayment();
  return (
    <Tabs defaultValue={paymentMethodsArr[1]}>
      <TabsList className="grid w-full grid-cols-1">
        {/* {paymentMethodsArr.map((method) => (
          <TabsTrigger key={method} value={method}>
            {method}
          </TabsTrigger>
        ))} */}
        <TabsTrigger value={paymentMethodsArr[1]}>
          {paymentMethodsArr[1]}
        </TabsTrigger>
      </TabsList>
      {/* <TabsContent value={paymentMethodsArr[0]} className="mt-4">
        <div className="rounded-lg border p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Pay using your preferred UPI app through Razorpay.
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={() =>
              mutate({
                json: {
                  paymentMethods: paymentMethodsArr[0],
                  [APPOINTMENT_ID_HASH_NAME]: appointmentIds,
                },
              })
            }
            disabled={isLoading}
          >
            {messages ||
              (isLoading
                ? "Processing..."
                : `Pay ₹${paymentInfo.totalCost.toLocaleString()}`)}
          </Button>
        </div>
      </TabsContent> */}

      <TabsContent value={paymentMethodsArr[1]} className="mt-4">
        <div className="rounded-lg border p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Pay with cash at the reception counter. Your appointment will be
            confirmed, but payment will need to be made in person.
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              mutate({
                json: {
                  paymentMethods: paymentMethodsArr[1],
                  [APPOINTMENT_ID_HASH_NAME]: appointmentIds,
                },
              });
            }}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : ` Confirm Booking (Pay ₹${paymentInfo.totalCost.toLocaleString()} at
            Reception)`}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentTabsSection;

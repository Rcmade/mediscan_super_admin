"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import React from "react";
import useConfirmCashPayment from "../../hooks/useConfirmCashPayment";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import useWebName from "@/hooks/useWebName";

interface ReceptionistPaymentConfirmationSectionProps {
  paymentInfo: InferResponseType<
    (typeof client.api.main.payments.appointment.view)["a"][":appointmentId"]["$get"],
    200
  >;
}

const ReceptionistPaymentConfirmationSection = ({
  paymentInfo,
}: ReceptionistPaymentConfirmationSectionProps) => {
  const { mutateAsync } = useConfirmCashPayment();
  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();
  const { webName } = useWebName();
  const handleConfirm = async () => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description: (
        <span>
          This action cannot be undone. This will permanently confirm the
          payment for{" "}
          <strong className="mx-2 text-2xl font-bold capitalize">
            {paymentInfo?.data?.user?.name}
          </strong>
          .
        </span>
      ),
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      setAlertDialogLoading(true);
      try {
        await mutateAsync({
          param: {
            orgWebName: webName,
          },
          json: {
            organization: {
              id: paymentInfo?.data?.payment?.orgId,
            },
            payment: {
              id: paymentInfo?.data?.payment?.id,
            },
          },
        });
        closeAlertDialog();
      } catch (error) {
        console.error("Error confirming payment:", error);
      } finally {
        setAlertDialogLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <p>Name</p>
          <p className="text-lg font-bold">{paymentInfo?.data?.user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Phone</p>
          <p className="text-lg font-bold">{paymentInfo?.data?.user?.phone}</p>
        </div>

        {paymentInfo?.data?.payment?.paymentStatus === "PENDING" && (
          <Button className="w-full" onClick={handleConfirm}>
            Confirm Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceptionistPaymentConfirmationSection;

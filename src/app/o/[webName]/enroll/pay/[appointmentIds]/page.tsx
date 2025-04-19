import { currentUser } from "@/action/currentUser";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APPOINTMENT_ID_HASH_NAME } from "@/constant";
import PaymentTabsSection from "@/feature/payments/appointmentPayments/components/sections/PaymentTabsSection";
import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { PagePropsPromise } from "@/types";
import { CreditCard, Package, Receipt, User } from "lucide-react";
import Script from "next/script";
import React, { Suspense } from "react";

const getAppointmentPaymentInfo = async ({
  webName,
  appointmentIds,
}: {
  webName: string;
  appointmentIds: string;
}) => {
  try {
    const hash = decodeURIComponent(appointmentIds);
    const res = await client.api.main.enroll[":webName"]["payment-overview"][
      "$post"
    ]({
      param: {
        webName,
      },
      json: {
        [APPOINTMENT_ID_HASH_NAME]: hash,
      },
    });
    if (!res.ok) throw await res.json();

    const data = await res.json();
    return { ...data, hash };
  } catch (error) {
    const err = await getReadableErrorMessage(error);
    return { error: err };
  }
};

const page = async ({ params }: PagePropsPromise) => {
  const awaitedParams = await params;
  const { appointmentIds, webName } = awaitedParams;
  if (!appointmentIds) {
    return <div>No appointment IDs provided</div>;
  }

  const paymentInfo = await getAppointmentPaymentInfo({
    webName,
    appointmentIds,
  });

  if ("error" in paymentInfo) {
    return <div>{paymentInfo.error}</div>;
  }

  const user = await currentUser();

  if (!user) {
    return (
      <>
        <div>Please log in to proceed with the payment.</div>
      </>
    );
  }
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground">
              Review your appointments and complete payment
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Appointment Details
                  </CardTitle>
                  <CardDescription>
                    Review your appointment details before proceeding to payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentInfo?.appointmentWithCost.map((item) => (
                        <TableRow key={item.appointment.id}>
                          <TableCell className="font-medium">
                            {item.appointment.patientName}
                          </TableCell>
                          <TableCell>
                            {item.appointment.reasonForVisit}
                          </TableCell>
                          <TableCell>{item.appointment.tokenNumber}</TableCell>
                          <TableCell className="text-right">
                            ₹{item.appointment?.price?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Select your preferred payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense>
                    <PaymentTabsSection
                      appointmentIds={paymentInfo.hash}
                      paymentInfo={paymentInfo}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Payment Summary
                  </CardTitle>
                  <CardDescription>
                    Summary of your appointments and total cost
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentInfo.appointmentWithCost.map((item) => (
                      <div
                        key={item.appointment.id}
                        className="flex justify-between"
                      >
                        <div className="text-sm">
                          <p className="font-medium">
                            {item.appointment.patientName}
                          </p>
                          <p className="text-muted-foreground">
                            {item.appointment.reasonForVisit}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{item.appointment?.price?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Subtotal</p>
                      <p className="font-medium">
                        ₹{paymentInfo.totalCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Tax</p>
                      <p className="font-medium">₹0</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <p className="text-base font-bold">Total</p>
                      <p className="text-base font-bold">
                        ₹{paymentInfo.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {/* <Button className="w-full" size="lg">
                  {paymentMethod === "cash"
                    ? "Confirm Booking"
                    : "Pay ₹" + data.totalCost.toLocaleString()}
                </Button> */}
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-5 w-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    If you have any questions about your appointments or
                    payment, please contact our support team at receptionist
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

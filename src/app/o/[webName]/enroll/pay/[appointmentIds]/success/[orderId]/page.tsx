import { PagePropsPromise } from "@/types";
import React from "react";
import { currentUser } from "@/action/currentUser";
import { client } from "@/lib/rcp";
import { InferRequestType } from "hono";
import ClientComponent from "./ClientComponent";
import { Calendar, CheckCircle2, Clock, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/dateUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const api =
  client.api.main.payments.appointment.view.u[":userId"]["o"][":orderId"][
    "$get"
  ];

const getOrderInfo = async (input: InferRequestType<typeof api>) => {
  const res = await api(input);
  if (res.status !== 200) {
    throw new Error("Failed to fetch order info");
  }
  const data = await res.json();
  return data;
};
const page = async ({ params }: PagePropsPromise) => {
  const awaitedParams = await params;
  const user = await currentUser();
  if (!user || !user.id) {
    return <div>Unauthorized</div>;
  }

  const orderId = awaitedParams.orderId;
  const paymentData = await getOrderInfo({
    param: {
      userId: user.id,
      orderId,
    },
  });

  return (
    <>
      <ClientComponent paymentId={paymentData?.data?.payment?.id}>
        <div className="mb-4 flex flex-col items-center gap-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Your payment of ₹
              {Number.parseFloat(
                paymentData?.data?.payment.totalAmount,
              ).toLocaleString()}{" "}
              has been processed successfully.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Transaction information and payment summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="font-medium">{paymentData?.data?.payment?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  ₹
                  {Number.parseFloat(
                    paymentData?.data?.payment?.totalAmount,
                  ).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {paymentData?.data?.payment?.paymentMethod}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="success" className="">
                  {paymentData?.data?.payment?.paymentStatus}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-medium">
                  {formatDate(paymentData?.data?.payment?.createdAt)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Confirmation Date
                </p>
                <p className="font-medium">
                  {formatDate(paymentData?.data?.payment?.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </CardTitle>
            <CardDescription>
              Information about your scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(paymentData?.data?.appointments || []).map((item) => (
                  <TableRow key={item?.appointment?.id}>
                    <TableCell className="font-medium">
                      {item?.appointment?.patientName}
                    </TableCell>
                    <TableCell>{item?.appointment?.reasonForVisit}</TableCell>
                    <TableCell>{item?.appointment?.tokenNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                      >
                        {item?.appointment?.appointmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹
                      {Number.parseFloat(
                        item?.paymentLink?.amount || "0",
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="flex w-full justify-between">
              <div className="text-sm font-medium">Total Amount</div>
              <div className="font-bold">
                ₹
                {Number.parseFloat(
                  paymentData?.data?.payment.totalAmount,
                ).toLocaleString()}
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              What&apos;s Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex flex-col gap-2">
                <div className="font-medium">Appointment Confirmation</div>
                <p className="text-sm text-muted-foreground">
                  Your appointments have been confirmed. Please arrive 15
                  minutes before your scheduled time and bring your token
                  number.
                </p>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex flex-col gap-2">
                <div className="font-medium">Need to Reschedule?</div>
                <p className="text-sm text-muted-foreground">
                  If you need to reschedule your appointment, please contact our
                  support team at least 24 hours in advance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ClientComponent>
    </>
  );
};

export default page;

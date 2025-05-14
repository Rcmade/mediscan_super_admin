"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import PaymentOverview from "@/feature/payments/appointmentPayments/components/sections/PaymentOverview";
import AppointmentTrends from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/AppointmentTrends";
import RevenueAnalysis from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/RevenueAnalysis";
import { PaymentStatusChart } from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/PaymentStatusChart";
import { VisitReasonChart } from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/VisitReasonChart";
import { formatCurrency } from "@/lib/utils";
import usePaymentOverview from "@/feature/payments/appointmentPayments/hooks/usePaymentOverview";
import { TrueFalseStr } from "@/types";
import Title from "@/feature/organization/components/sections/Title";

interface PaymentDashboardContentProps {
  isOverviewOnly: TrueFalseStr;
}

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function PaymentDashboardContent({
  isOverviewOnly,
}: PaymentDashboardContentProps) {
  const { data: stats, isLoading } = usePaymentOverview(isOverviewOnly);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Failed to load dashboard stats.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <Title />

      <PaymentOverview stats={stats.overview} />

      {isOverviewOnly === "false" && (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Appointment trends Chart */}
            <AppointmentTrends stats={stats.appointmentChart} />

            {/* Revenue Chart */}
            <RevenueAnalysis stats={stats.revenueChart} />
          </div>

          {/* Additional Charts and Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Payment Status Pie Chart */}
            <PaymentStatusChart stats={stats.paymentPieChart} />
            {/* Visit Reasons */}
            <VisitReasonChart stats={stats.visitReasonCounts} />

            {/* Pending Payments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>Outstanding payments</CardDescription>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex h-64 flex-col items-center justify-center">
                  <div className="text-4xl font-bold">
                    {formatCurrency(stats.overview.pendingPayments)}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {stats.overview.pendingCount} pending payment
                    {stats.overview.pendingCount !== 1 ? "s" : ""}
                  </p>
                  {stats.overview.pendingCount === 0 && (
                    <p className="mt-4 flex items-center text-emerald-500">
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                      All payments completed
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Recent Appointments Table */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest patient appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patientName}
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.date), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {appointment.reason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "Scheduled"
                          ? "outline"
                          : "default"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.paymentStatus === "COMPLETED"
                          ? "success"
                          : appointment.paymentStatus === "UNKNOWN"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {appointment.paymentStatus === "UNKNOWN"
                        ? "Pending"
                        : appointment.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(appointment.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
}

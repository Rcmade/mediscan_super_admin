import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, CreditCard, DollarSign, Users } from "lucide-react";
import React from "react";
import { PaymentOverviewResponseT } from "../../types";

interface PaymentOverviewProps {
  stats: PaymentOverviewResponseT["overview"];
}
const PaymentOverview = ({ stats }: PaymentOverviewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Appointments
          </CardTitle>
          <CalendarCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.totalAppointments || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.appointmentChange > 0 ? "+" : ""}
            {stats?.appointmentChange || 0}% from previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{stats?.totalRevenue?.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.revenueChange > 0 ? "+" : ""}
            {stats?.revenueChange || 0}% from previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{stats?.pendingPayments?.toFixed(2) || "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.pendingCount || 0} payments pending
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Patients</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.uniquePatients || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats?.newPatients || 0} new patients this period
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOverview;

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";
import { PaymentOverviewResponseT } from "../../types";
import { formatCurrency } from "@/lib/utils";

interface PaymentOverviewProps {
  stats: PaymentOverviewResponseT["overview"];
}
const PaymentOverview = ({ stats }: PaymentOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Appointments
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            {stats.appointmentChange >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
            )}
            <span
              className={
                stats.appointmentChange >= 0
                  ? "text-emerald-500"
                  : "text-rose-500"
              }
            >
              {stats.appointmentChange}% from previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            {stats.revenueChange >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />
            )}
            <span
              className={
                stats.revenueChange >= 0 ? "text-emerald-500" : "text-rose-500"
              }
            >
              {stats.revenueChange}% from previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Unique Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniquePatients}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Total patients seen
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Patients</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newPatients}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            First-time visits
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOverview;

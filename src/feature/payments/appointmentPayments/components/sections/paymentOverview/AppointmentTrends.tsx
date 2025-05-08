"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { PaymentOverviewResponseT } from "../../../types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AppointmentTrendsProps {
  stats: PaymentOverviewResponseT["appointmentChart"];
}
const AppointmentTrends: React.FC<AppointmentTrendsProps> = ({ stats }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>
          Scheduled, completed, and cancelled appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            scheduled: {
              label: "Scheduled",
              color: "hsl(var(--chart-1))",
            },
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-2))",
            },
            cancelled: {
              label: "Cancelled",
              color: "hsl(var(--chart-3))",
            },
          }}
        >
          <BarChart
            data={stats}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="scheduled" fill="var(--color-scheduled)" />
            <Bar dataKey="completed" fill="var(--color-completed)" />
            <Bar dataKey="cancelled" fill="var(--color-cancelled)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AppointmentTrends;

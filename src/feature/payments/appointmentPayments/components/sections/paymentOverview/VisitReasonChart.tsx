"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PaymentOverviewResponseT } from "../../../types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";



interface VisitReasonChartProps {
  stats: PaymentOverviewResponseT["visitReasonCounts"];
}

export function VisitReasonChart({ stats }: VisitReasonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit Reasons</CardTitle>
        <CardDescription>Common reasons for appointments</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ChartContainer
          config={{
            count: {
              label: "Count",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <BarChart
            layout="vertical"
            data={stats}
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="reason" type="category" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

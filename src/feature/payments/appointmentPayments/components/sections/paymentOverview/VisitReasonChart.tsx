"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PaymentOverviewResponseT } from "../../../types";

interface VisitReasonChartProps {
  stats: PaymentOverviewResponseT["visitReasonCounts"];
}

export function VisitReasonChart({ stats }: VisitReasonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Visit Reasons</CardTitle>
        <CardDescription>
          Most common reasons for patient visits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats}
              margin={{
                top: 5,
                right: 10,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#888"
                strokeOpacity={0.2}
              />
              <XAxis
                type="number"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="reason"
                type="category"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(value) => [`${value}`, "Count"]} />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

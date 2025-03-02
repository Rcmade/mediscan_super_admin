"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { DashboardStatsResponseT } from "../../types/dashboard";

type BusiestHour = DashboardStatsResponseT["trends"]["busiestHours"][number];

export interface TrendChartProps {
  data: DashboardStatsResponseT["trends"]["topVisitReasons"] | BusiestHour[];
  title: string;
  description: string;
  dataKey: string;
  nameKey: string;
}

const TrendChart = ({
  data,
  title,
  description,
  dataKey,
  nameKey,
}: TrendChartProps) => {
  const transformedData = useMemo(() => {
    if (data.length > 0 && "hour" in data[0]) {
      return (data as BusiestHour[])
        .map((hourData) => {
          const utcHour = hourData.hour;

          // Convert UTC hour to local hour
          const now = new Date();
          now.setUTCHours(utcHour, 0, 0, 0); // Set time to the UTC hour
          const localHour = now.getHours();

          // Get the next hour for range display
          const nextHour = (localHour + 1) % 24;

          return {
            ...hourData,
            timeRange: `${localHour}:00 - ${nextHour}:00`,
            localHour,
          };
        })
        .sort((a, b) => a.localHour - b.localHour);
    }
    return data;
  }, [data]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {description}
          {title === "Busiest Hours" && " (Local Time)"}
        </p>
      </CardHeader>
      <CardContent className="h-[300px] p-0 pt-4 sm:p-2 md:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{ top: 5, right: 30, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={nameKey}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis
              allowDecimals={false} // Prevent decimal values
            />
            <Tooltip
              formatter={(value) => [value, dataKey]}
              labelFormatter={(label) => {
                if (title === "Busiest Hours") {
                  return `Time: ${label}`;
                }
                return label;
              }}
            />
            <Bar dataKey={dataKey} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendChart;

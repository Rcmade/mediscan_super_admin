//

import { currentUser } from "@/action/currentUser";
import { AppointmentStatsCard } from "@/feature/admin/dashboard/components/cards/AppointmentStatsCard";
import TrendChart from "@/feature/admin/dashboard/components/chart/TrendChart";
import { client } from "@/lib/rcp";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  Percent,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import React from "react";
// import ClientComponents from "./_ClientComponents";
import AddOrgButton from "@/feature/admin/dashboard/components/button/AddOrgButton";

export const revalidate = 600;

// Add metadata configuration
export const metadata: Metadata = {
  title: "Appointment Dashboard | Admin Panel",
  description:
    "View and manage appointment statistics including booked, confirmed, and cancelled appointments.",
  keywords: "appointments, dashboard, admin, booking management, statistics",
  openGraph: {
    title: "Appointment Dashboard | Admin Panel",
    description:
      "View and manage appointment statistics including booked, confirmed, and cancelled appointments.",
    type: "website",
    siteName: "Your Site Name",
    locale: "en_US",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const getStats = async () => {
  try {
    const res = await client.api.main.admin.dashboard.stats.$get({ query: {} });

    if (!res.ok) {
      throw await res.json();
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error({ error });
    return error as Error;
  }
};
const page = async () => {
  const user = await currentUser();
  if (!user || (user?.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return <div>Not Authorized</div>;
  }

  const stats = await getStats();
  if (!stats || "message" in stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">
          {String(
            (stats as { message: string })?.message ||
              "Failed to load dashboard data",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="my-2 flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Appointment Dashboard</h1>
          <AddOrgButton />
        </div>
        {/* Basic Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <AppointmentStatsCard
            title="Booked Appointments"
            value={stats.appointmentStats.scheduled}
            icon={<Calendar className="h-6 w-6" />}
            description="Currently scheduled appointments"
          />
          <AppointmentStatsCard
            title="Completed Appointments"
            value={stats.appointmentStats.completed}
            icon={<CalendarCheck className="h-6 w-6" />}
            description="Successfully completed appointments"
          />
          <AppointmentStatsCard
            title="Cancelled Appointments"
            value={stats.appointmentStats.cancelled}
            icon={<CalendarX className="h-6 w-6" />}
            description="Cancelled appointments"
          />
        </div>

        {/* Operational Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <AppointmentStatsCard
            title="Average Daily Appointments"
            value={stats.operationalMetrics.averageAppointmentsPerDay}
            icon={<Users className="h-6 w-6" />}
            description="Average appointments per day"
          />
          <AppointmentStatsCard
            title="Completion Rate"
            value={`${stats.operationalMetrics.completionRate}%`}
            icon={<Percent className="h-6 w-6" />}
            description="Percentage of completed appointments"
          />
          <AppointmentStatsCard
            title="Cancellation Rate"
            value={`${stats.operationalMetrics.cancellationRate}%`}
            icon={<Clock className="h-6 w-6" />}
            description="Percentage of cancelled appointments"
          />
        </div>

        {/* Trends Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <TrendChart
            data={stats.trends.topVisitReasons}
            title="Top Visit Reasons"
            description="Most common reasons for appointments"
            dataKey="count"
            nameKey="reason"
          />
          <TrendChart
            data={stats.trends.busiestHours}
            title="Busiest Hours"
            description="Peak appointment hours"
            dataKey="count"
            nameKey="timeRange"
          />
        </div>
      </div>
    </div>
  );
};

export default page;

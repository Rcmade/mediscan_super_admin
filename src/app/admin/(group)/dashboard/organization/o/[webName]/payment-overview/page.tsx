// import PaymentStatsClient from "@/feature/payments/appointmentPayments/components/sections/PaymentStatsClient";
import StartEndButton from "@/components/buttons/StartEndButton";
import PaymentOverview from "@/feature/payments/appointmentPayments/components/sections/PaymentOverview";
import AppointmentTrends from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/AppointmentTrends";
// import { PaymentStatusChart } from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/PaymentStatusChart";
import { RecentAppointments } from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/RecentAppointments";
import RevenueAnalysis from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/RevenueAnalysis";
import { VisitReasonChart } from "@/feature/payments/appointmentPayments/components/sections/paymentOverview/VisitReasonChart";
import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { PagePropsPromise, SearchParams } from "@/types";
import React from "react";

const getStats = async ({
  searchParams,
  webName,
}: {
  searchParams: SearchParams;
  webName: string;
}) => {
  try {
    const res = await client.api.main.payments.appointment["payment-overview"][
      "o"
    ][":doctorWebName"].$get({
      query: {
        startDate: searchParams?.startDate,
        endDate: searchParams?.endDate,
      },
      param: { doctorWebName: webName },
    });

    if (!res.ok) {
      throw await res.json();
    }

    const stats = await res.json();

    return stats;
  } catch (error) {
    const err = await getReadableErrorMessage(error);
    return { message: err };
  }
};

const page = async ({ searchParams, params }: PagePropsPromise) => {
  const searchParamsAwaited = await searchParams;
  const webName = (await params).webName;
  if (!webName) {
    return <div>Not Authorized</div>;
  }

  const stats = await getStats({
    searchParams: searchParamsAwaited,
    webName,
  });

  if (!stats || "message" in stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">
          {String(
            (stats as { message: string })?.message ||
              "Failed to load dashboard stats",
          )}
        </p>
      </div>
    );
  }

  return (
    // <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    //   <StartEndButton />

    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //       <CardTitle className="text-sm font-medium">
    //         Total Appointments
    //       </CardTitle>
    //       <CalendarCheck className="h-5 w-5 text-muted-foreground" />
    //     </CardHeader>
    //     <CardContent>
    //       <div className="text-2xl font-bold">
    //         {stats?.totalAppointments || 0}
    //       </div>
    //       <p className="text-xs text-muted-foreground">
    //         {stats?.appointmentChange > 0 ? "+" : ""}
    //         {stats?.appointmentChange || 0}% from previous period
    //       </p>
    //     </CardContent>
    //   </Card>
    //   {/* <PaymentStatsClient /> */}
    // </div>
    <>
      {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}

      <div className="flex flex-col gap-6 p-6 md:p-8">
        <StartEndButton />
        <PaymentOverview stats={stats.overview} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AppointmentTrends stats={stats?.appointmentChart} />
          <RevenueAnalysis stats={stats?.revenueChart} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* <PaymentStatusChart stats={stats?.paymentPieChart} /> */}
          <VisitReasonChart stats={stats?.visitReasonCounts} />
        </div>
        <RecentAppointments stats={stats?.recentAppointments} />
      </div>
    </>
  );
};

export default page;

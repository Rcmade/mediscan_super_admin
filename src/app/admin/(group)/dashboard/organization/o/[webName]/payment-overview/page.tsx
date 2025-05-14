import StartEndButton from "@/components/buttons/StartEndButton";
// import { client } from "@/lib/rpc";
// import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
// import { PagePropsPromise, SearchParams } from "@/types";
import React, { Suspense } from "react";
import DashboardContent from "./PaymentDashboardContent";
import Title from "@/feature/organization/components/sections/Title";

// const getStats = async ({
//   searchParams,
//   webName,
// }: {
//   searchParams: SearchParams;
//   webName: string;
// }) => {
//   try {
//     const res = await client.api.main.payments.appointment["payment-overview"][
//       "o"
//     ][":doctorWebName"].$get({
//       query: {
//         startDate: searchParams?.startDate,
//         endDate: searchParams?.endDate,
//       },
//       param: { doctorWebName: webName },
//     });

//     if (!res.ok) {
//       throw await res.json();
//     }

//     const stats = await res.json();

//     return stats;
//   } catch (error) {
//     const err = await getReadableErrorMessage(error);
//     return { message: err };
//   }
// };

const page = async () => {
  // const searchParamsAwaited = await searchParams;
  // const webName = (await params).webName;

  // const stats = await getStats({
  //   searchParams: searchParamsAwaited,
  //   webName,
  // });

  // if (!stats || "message" in stats) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <p className="text-lg text-muted-foreground">
  //         {String(
  //           (stats as { message: string })?.message ||
  //             "Failed to load dashboard stats",
  //         )}
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Title />

      {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
      <StartEndButton />
      <Suspense>
        <DashboardContent isOverviewOnly="false" />
      </Suspense>
      {/* 
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <PaymentOverview stats={stats.overview} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AppointmentTrends stats={stats?.appointmentChart} />
          <RevenueAnalysis stats={stats?.revenueChart} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PaymentStatusChart stats={stats?.paymentPieChart} />
          <VisitReasonChart stats={stats?.visitReasonCounts} />
        </div>
        // <RecentAppointments stats={stats?.recentAppointments} />
      </div> */}
    </div>
  );
};

export default page;

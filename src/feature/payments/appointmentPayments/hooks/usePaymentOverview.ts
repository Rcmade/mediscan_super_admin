import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { TrueFalseStr } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const usePaymentOverview = (isOverviewOnly: TrueFalseStr = "false") => {
  const searchParams = useSearchParams();
  const { webName } = useWebName();

  return useQuery({
    queryKey: ["payment-overview", searchParams.toString()],
    queryFn: async () => {
      const res = await client.api.main.payments.appointment[
        "payment-overview"
      ]["o"][":doctorWebName"].$get({
        query: {
          startDate:
            searchParams?.get("startDate") ||
            searchParams?.get("fromDate") ||
            undefined,
          endDate:
            searchParams?.get("endDate") ||
            searchParams?.get("toDate") ||
            undefined,
          isOverviewOnly,
        },
        param: { doctorWebName: webName },
      });

      if (!res.ok) {
        throw await res.json();
      }

      const stats = await res.json();

      return stats;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 0,
  });
};

export default usePaymentOverview;

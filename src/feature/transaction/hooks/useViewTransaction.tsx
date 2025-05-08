import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

const api = client.api.main.org.transactions.$get;
export type TransactionRequestType = InferRequestType<typeof api>;
export type TransactionResponseType = InferResponseType<typeof api, 200>;
const useViewDueTransaction = () => {
  const searchParams = useSearchParams();
  const { webName } = useWebName();
  const filter: TransactionRequestType = {
    query: {
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      search: searchParams.get("search") || webName || undefined,
      fromDate: searchParams.get("fromDate") || undefined,
      toDate: searchParams.get("toDate") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    },
  };
  const query = useQuery({
    queryKey: ["transactions", filter],
    queryFn: async () => {
      const res = await api({
        query: filter.query,
        // param: { webName: webName as string },
      });
      const data = await res.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    // refetchInterval: 10000, //10 sec
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    filter,
  };
};

export default useViewDueTransaction;

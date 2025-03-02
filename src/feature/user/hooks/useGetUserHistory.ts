import { client } from "@/lib/rcp";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const api = client.api.main.user.history.$get;
export type HistoryResponseType = InferResponseType<typeof api, 200>;
const useGetUserHistory = () => {
  return useQuery<HistoryResponseType>({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api();
      if (!res.ok) throw await res.json();
      const data = await res.json();
      return data;
    },
  });
};

export default useGetUserHistory;

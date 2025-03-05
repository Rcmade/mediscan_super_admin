import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rcp";
import { InferResponseType, InferRequestType } from "hono";
import useWebName from "@/hooks/useWebName";

const api = client.api.main.token.search[":webName"]["$get"];

export type UseSearchTokenResponseT = InferResponseType<typeof api, 200>;
type RequestType = InferRequestType<typeof api>;

export const useSearchToken = (query: RequestType["query"] = {}) => {
  const { webName } = useWebName();
  return useQuery({
    queryKey: [
      "appointments",
      {
        page: query.page || undefined,
        limit: query.limit || undefined,
        search: query.search || undefined,
        startTime: query.startTime || undefined,
        endOfDay: query.endOfDay || undefined,
      },
    ],
    queryFn: async () => {
      const res = await api({
        query,
        param: { webName: webName as string },
      });
      const data = await res.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    refetchInterval: 10000, //10 sec
    placeholderData: keepPreviousData,
  });
};

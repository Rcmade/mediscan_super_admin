import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rcp";
import { InferResponseType, InferRequestType } from "hono";

const api = client.api.main.org["$get"];

export type UseViewOrgResponseT = InferResponseType<typeof api, 200>;
type RequestType = InferRequestType<typeof api>;

export const useViewOrg = (query: RequestType["query"] = {}) => {
  return useQuery({
    queryKey: [
      "organizations",
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
      });
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();

      return data;
    },
    // refetchInterval: 10000, //10 sec
    placeholderData: keepPreviousData,
  });
};

// type a = UseViewOrgResponseT['data']

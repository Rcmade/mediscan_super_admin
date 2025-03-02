import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rcp";
import { InferResponseType, InferRequestType } from "hono";

const api = client.api.main.token.display["$get"];

export type UseGetDisplayTokenResponseT = InferResponseType<typeof api, 200>;
type RequestType = InferRequestType<typeof api>;

export const useGetDisplayToken = (query: RequestType["query"] = {}) => {
  return useQuery({
    queryKey: ["display"],
    queryFn: async () => {
      const res = await api({
        query,
      });
      const data = await res.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    refetchInterval: 10000, //10 sec
  });
};

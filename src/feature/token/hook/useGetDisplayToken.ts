import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rcp";
import { InferResponseType, InferRequestType } from "hono";
import useWebName from "@/hooks/useWebName";

const api = client.api.main.token.display[":webName"]["$get"];

export type UseGetDisplayTokenResponseT = InferResponseType<typeof api, 200>;
type RequestType = InferRequestType<typeof api>;

export const useGetDisplayToken = (query: RequestType["query"] = {}) => {
  const { webName } = useWebName();

  return useQuery({
    queryKey: ["display", webName],
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
  });
};

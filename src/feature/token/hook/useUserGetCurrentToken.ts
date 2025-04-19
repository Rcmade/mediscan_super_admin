import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

const api = client.api.main.token.recent[":phoneNo"]["$get"];

export type UserGetCurrentTokenResponseT = InferResponseType<typeof api, 200>;

export const useUserGetCurrentToken = (phoneNo: string) => {
  return useQuery({
    queryKey: ["userTokens", phoneNo],
    queryFn: async () => {
      const res = await api({ param: { phoneNo } });
      const data = await res.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    staleTime: 60000,
  });
};

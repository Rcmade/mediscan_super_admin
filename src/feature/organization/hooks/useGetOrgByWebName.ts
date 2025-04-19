import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";
import { toast } from "sonner";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";

const api = client.api.main.org.o[":orgName"]["$get"];

export type UseGetOrgByWebNameResponseT = InferResponseType<typeof api, 200>;

export const useGetOrgByWebName = () => {
  return useMutation({
    mutationFn: async (orgName: string) => {
      if (!orgName) throw new Error("Organization name is required.");
      const res = await api({
        param: { orgName: orgName },
      });
      if (!res.ok) throw res;
      const data = await res.json();

      return data;
    },
    onError: (error) => {
      toast.error(getReadableErrorMessage(error));
    },
  });
};

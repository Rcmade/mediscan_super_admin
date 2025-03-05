import { InferResponseType } from "hono";
import { client } from "@/lib/rcp";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const api = client.api.main.org.users["user-org"]["$get"];
type GetUserOrgResponse = InferResponseType<typeof api, 200>;
const useGetUserOrg = () => {
  return useQuery<GetUserOrgResponse>({
    queryKey: ["userOrg"],
    queryFn: async () => {
      const res = await api();
      const data = await res.json();
      if ("organizations" in data) {
        return data;
      } else {
        toast.error(data?.error);
        throw new Error(data.error);
      }
    },
  });
};

export default useGetUserOrg;

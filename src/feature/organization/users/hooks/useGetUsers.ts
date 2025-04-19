import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

const api = client.api.main.org.users[":doctorWebName"]["$get"];
export type useGetUsersResponseT = InferResponseType<typeof api, 200>;

const useGetUsers = () => {
  const { webName } = useWebName();
  const data = useQuery({
    queryKey: ["users", webName],
    queryFn: async () => {
      const res = await api({
        param: { doctorWebName: webName },
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(getReadableErrorMessage(err));
        throw err;
      }
      const data = await res.json();
      return data;
    },
    enabled: !!webName,
  });
  return { ...data, webName };
};

export default useGetUsers;

import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rcp";
import { useQuery } from "@tanstack/react-query";
// import { InferResponseType } from "hono";

const api = client.api.main.org.subscription[":webName"].$get;
// type ResponseType = InferResponseType<typeof api, 200>;
const useViewSubscription = () => {
  const { webName } = useWebName();
  return useQuery({
    queryKey: ["subscription", webName],
    queryFn: async () => {
      const res = await api({
        param: { webName },
      });
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      return data;
    },
    enabled: !!webName,
  });
};

export default useViewSubscription;

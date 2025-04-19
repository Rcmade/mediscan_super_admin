import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

const api = client.api.main.token.t[":appointmentId"]["$get"];

export type UseGetAppointmentResponseT = InferResponseType<typeof api, 200>;

export const useGetAppointment = (appointmentId?: string) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      const res = await api({
        param: { appointmentId: appointmentId! },
      });
      const data = await res.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    enabled: !!appointmentId,
  });
};

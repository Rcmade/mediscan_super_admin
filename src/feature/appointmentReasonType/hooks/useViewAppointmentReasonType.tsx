import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const api =
  client.api.main.features["appointment-reasons"]["o"][":orgWebName"]["$get"];

export type ViewAppointmentReasonTypeResponse = InferResponseType<
  typeof api,
  200
>;
export type ViewAppointmentReasonTypeRequest = InferRequestType<typeof api>;

const useViewAppointmentReasonType = () => {
  const { webName } = useWebName();
  return useQuery({
    queryKey: ["viewAppointmentReasonType", webName],
    queryFn: async () => {
      const res = await api({
        param: {
          orgWebName: webName,
        },
      });
      if (!res.ok) {
        return {
          appointmentReasons: [],
        };
      }
      return await res.json();
    },
  });
};

export default useViewAppointmentReasonType;
// I am on a mission to make the world a better place by writing clean and efficient code. I believe that every line of code should be purposeful and contribute to the overall functionality of the application. I strive to write code that is easy to read, maintain, and understand, so that others can benefit from my work and build upon it in the future. I am committed to continuous learning and improvement, and I am always looking for ways to enhance my skills and knowledge in the field of software development.
// I am on editing and viewing appointment reasons

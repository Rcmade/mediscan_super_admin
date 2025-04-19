import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";
import { toast } from "sonner";
import { RazorpayResponseT } from "@/types";
import { useRouter } from "next/navigation";
import useWebName from "@/hooks/useWebName";
import useAppointmentIds from "./useAppointmentIds";

const api = client.api.main.payments["appointment"]["initiate"]["$post"];

type RequestType = InferRequestType<typeof api>;
type ResponseType = InferResponseType<typeof api, 200>;

declare global {
  interface Window {
    Razorpay: unknown; // Use 'any' or define a more specific type if available
  }
}

const useInitiateAppointmentPayment = () => {
  const [messages, setMessages] = useState("");
  const { replace } = useRouter();
  const { webName } = useWebName();
  const [isLoading, setIsLoading] = useState(false);
  const { appointmentIds } = useAppointmentIds();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      setMessages("");
      const res = await api({ json });
      if (!res.ok) {
        throw await res.json();
      }
      const data = await res.json();

      return data;
    },

    onSuccess: (data) => {
      setMessages(data.message);
      try {
        if (data.paymentMethod === "ONLINE") {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
            name: data.userInfo?.name,
            currency: data?.razorpayOrder?.currency || "INR",
            amount: data?.razorpayOrder?.amount,
            order_id: data.razorpayOrder?.id,

            handler: async function (response: RazorpayResponseT) {
              if (response.razorpay_payment_id) {
                setIsLoading(true);
                setMessages("Redirecting, Please wait...");
                replace(
                  `/o/${webName}/enroll/pay/${appointmentIds}/success/${data.paymentId}`,
                );
              } else {
                throw new Error(
                  "Payment failed. Please try again. Contact support for help",
                );
              }
            },
            prefill: {
              name: data.userInfo?.name,
              contact: data.userInfo?.phone,
            },
          };
          setIsLoading(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.open();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          paymentObject.on("payment.failed", function (response: any) {
            console.error({ response });
            toast.error(
              "Payment failed. Please try again. Contact support for help",
            );
          });
        }

        setIsLoading(true);
        setMessages("Redirecting, Please wait...");
        replace(
          `/o/${webName}/enroll/pay/${appointmentIds}/success/${data.paymentId}`,
        );
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error(getReadableErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },

    onError: async (err) => {
      const error = await getReadableErrorMessage(err);
      console.error("Error initiating appointment payment:", error);
      toast.error(error);
    },
  });
  return {
    ...mutation,
    messages,
    isLoading: mutation.isPending || isLoading,
  };
};

export default useInitiateAppointmentPayment;

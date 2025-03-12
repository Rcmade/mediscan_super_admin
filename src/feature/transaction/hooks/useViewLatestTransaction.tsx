import { client } from "@/lib/rcp";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const api =
  client.api.main.org.transactions["last-transaction"][":orgWebName"]["$get"];

type ViewLatestTransactionResponseType = InferResponseType<typeof api, 200>;
type ViewTransactionRequestType = InferRequestType<typeof api>;

const useViewLatestTransaction = () => {
  return useMutation<
    ViewLatestTransactionResponseType,
    Error,
    ViewTransactionRequestType
  >({
    mutationFn: async (param) => {
      const response = await api({
        ...param,
      });
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      return data;
    },
  });
};

export default useViewLatestTransaction;

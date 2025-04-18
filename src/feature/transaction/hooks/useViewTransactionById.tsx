import { client } from "@/lib/rcp";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const api = client.api.main.org.transactions[":orgWebName"]["$get"];

export type ViewTransactionByIdResponseType = InferResponseType<
  typeof api,
  200
>;
export type ViewTransactionByIdRequestType = InferRequestType<typeof api>;

const useViewTransactionById = () => {
  return useMutation<
    ViewTransactionByIdResponseType,
    Error,
    ViewTransactionByIdRequestType
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

export default useViewTransactionById;

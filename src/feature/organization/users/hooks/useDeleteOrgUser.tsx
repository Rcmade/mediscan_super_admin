import { client } from "@/lib/rcp";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const api = client.api.main.org.users[":doctorWebName"][":userId"]["$delete"];
type RequestType = InferRequestType<typeof api>;
type ResponseType = InferResponseType<typeof api, 200>;

const useDeleteOrgUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async (requestData) => {
      const response = await api(requestData);
      if (!response.ok) throw response;
      return await response.json();
    },

    onError: async (err) => {
      const error = await getReadableErrorMessage(err);
      toast.error(error);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["users", data.webName],
      });
    //   setTimeout(() => {
    //     onClose();
    //   }, 0);
    },
  });

  return mutation;
};

export default useDeleteOrgUser;

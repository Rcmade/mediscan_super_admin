import { useAlertDialog } from "@/hooks/useAlertDialog";
import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const api =
  client.api.main.features["appointment-reasons"]["o"][":orgWebName"][
    ":appointmentReasonId"
  ]["$delete"];

type RequestType = InferRequestType<typeof api>;
type ResponseType = InferResponseType<typeof api, 200>;

const useDeleteAppointmentReasonType = () => {
  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();
  const queryClient = useQueryClient();
  const { webName } = useWebName();

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
        queryKey: ["viewAppointmentReasonType", webName],
      });

      setAlertDialogLoading(false);
      setTimeout(() => {
        closeAlertDialog();
      }, 0);
    },
  });

  const handleDelete = async (input: RequestType) => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description: (
        <span>
          This action cannot be undone. This will permanently delete the
          appointment reason type.
        </span>
      ),
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      setAlertDialogLoading(true);
      await mutation.mutateAsync(input);
    }
  };

  return { mutation, handleDelete };
};

export default useDeleteAppointmentReasonType;

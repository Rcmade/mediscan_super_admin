"use client";

import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rpc";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// This button can be only used to delete the current org because it depends on the url path
// API setup
const api = client.api.main.org.o[":orgName"]["$delete"];

type ResponseType = InferResponseType<typeof api, 200>;
type RequestType = InferRequestType<typeof api>;

const DeleteOrgButton = () => {
  const { webName } = useWebName();
  const queryClient = useQueryClient();
  const { replace } = useRouter();

  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();

  const { mutate, isPending } = useMutation<ResponseType, unknown, RequestType>(
    {
      mutationFn: async () => {
        setAlertDialogLoading(true);
        const response = await api({
          param: { orgName: webName },
        });

        if (!response.ok) throw await response.json();
        const data = await response.json();
        return data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success(data?.message || "Organization deleted successfully");
        setAlertDialogLoading(false);
        replace("/admin/dashboard/organization");
        closeAlertDialog();
      },
      onError: (error) => {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
        setAlertDialogLoading(false);
      },
    },
  );
  const handleDelete = async () => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description: (
        <span>
          This action cannot be undone. This will permanently delete the org
          <strong className="mx-2 text-2xl font-bold capitalize">
            {webName && decodeURIComponent(webName)}
          </strong>
          .
        </span>
      ),
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });

    if (confirmed) {
      mutate({ param: { orgName: webName } });
    }
  };

  return (
    <Button
      variant="destructive"
      spinner
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash size={16} /> Delete
    </Button>
  );
};

export default DeleteOrgButton;

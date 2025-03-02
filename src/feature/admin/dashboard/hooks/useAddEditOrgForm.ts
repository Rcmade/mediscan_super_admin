import { useForm } from "react-hook-form";
import { useAddEditOrgDialog } from "./useAddEditOrgDialog";
import {
  createOrgSchemaWithRefine,
  OrgFormValues,
} from "@/zodSchema/organizationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { toast } from "sonner";

const createApi = client.api.main.org.$post;
const editApi = client.api.main.org["o"][":orgName"]["$put"];

type CreateRequestType = InferRequestType<typeof createApi>;
type CreateResponseType = InferResponseType<typeof createApi, 201>;

type EditRequestType = InferRequestType<typeof editApi>;
type EditResponseType = InferResponseType<typeof editApi, 200>;

type RequestType =
  | { data: CreateRequestType; type: "create" }
  | { data: EditRequestType; type: "edit" };

type ResponseType =
  | { data: EditResponseType; type: "edit" }
  | { data: CreateResponseType; type: "create" };

const useAddEditOrgForm = () => {
  const { orgInfo, onClose } = useAddEditOrgDialog();

  const queryClient = useQueryClient();
  const getDefaultValues = () => {
    if (orgInfo?.type === "edit") {
      return {
        doctorName: orgInfo.orgInfo.name || "",
        doctorWebName: orgInfo.orgInfo.doctorWebName || "",
        phone: orgInfo.orgInfo.phone || "+91",
        userLimit: orgInfo.orgInfo.userLimit || 1,
        serviceStartDate: orgInfo.orgInfo.serviceStartDate
          ? new Date(orgInfo.orgInfo.serviceStartDate)
          : undefined,
        serviceEndDate: orgInfo.orgInfo.serviceEndDate
          ? new Date(orgInfo.orgInfo.serviceEndDate)
          : undefined,
      };
    }
    return {
      doctorName: "",
      doctorWebName: "",
      phone: "+91",
      userLimit: 1,
    };
  };

  // Initialize the form with react-hook-form
  const form = useForm<OrgFormValues>({
    resolver: zodResolver(createOrgSchemaWithRefine),
    defaultValues: getDefaultValues(),
  });

  const { mutate, isPending } = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (info) => {
      if (info.type === "create") {
        const res = await createApi(info.data);
        if (!res.ok) throw res;
        const data = await res.json();
        return { data, type: "create" };
      } else if (info.type === "edit") {
        const res = await editApi(info.data);
        if (!res.ok) throw res;
        const data = await res.json();
        return { data, type: "edit" };
      }
      throw new Error("Invalid type");
    },
    onError: (err) => {
      const error = getReadableErrorMessage(err);
      toast.error(error);
    },
    onSuccess: ({ data }) => {
      // toast.success(data.data.message);
      if ("message" in data) {
      } else {
      }
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      setTimeout(() => {
        onClose();
      }, 0);
    },
  });

  // Form submission handler
  function handleSubmit(data: OrgFormValues) {
    if (orgInfo?.type === "edit") {
      mutate({
        data: { json: data, param: { orgName: orgInfo.orgInfo.doctorWebName } },
        type: "edit",
      });
    } else {
      mutate({ data: { json: data }, type: "create" });
    }
  }

  const isLoading = form.formState.isSubmitting || isPending;
  const startDate = form.watch("serviceStartDate");

  return {
    form,
    handleSubmit,
    isLoading,
    orgInfo,
    startDate,
  };
};

export default useAddEditOrgForm;

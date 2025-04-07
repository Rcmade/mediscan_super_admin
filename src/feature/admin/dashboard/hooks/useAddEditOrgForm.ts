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
import useViewLatestTransaction from "@/feature/transaction/hooks/useViewLatestTransaction";
import { useEffect } from "react";

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
  const transaction = useViewLatestTransaction();
  const getDefaultValues = (): Partial<OrgFormValues> => {
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
        transaction: {
          // total: orgInfo.orgInfo.transaction.total,
          // paid: orgInfo.orgInfo.transaction.paid,
          // due: orgInfo.orgInfo.transaction.due,
          total: 0,
          paid: 0,
          due: 0,
        },
      };
    }
    return {
      doctorName: "",
      doctorWebName: "",
      phone: "+91",
      userLimit: 1,
      transaction: {
        total: 0,
        paid: 0,
        due: 0,
      },
    };
  };

  // Initialize the form with react-hook-form
  const form = useForm<OrgFormValues>({
    resolver: zodResolver(createOrgSchemaWithRefine),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    const a = async () => {
      if (orgInfo?.type === "edit") {
        try {
          const transactionData = await transaction.mutateAsync({
            param: { orgWebName: orgInfo.orgInfo.doctorWebName },
          });

          if (transactionData) {
            form.reset({
              ...getDefaultValues(),
              transaction: {
                total: +transactionData.total,
                paid: +transactionData.paid,
                due: +transactionData.due,
                transactionId: transactionData.id,
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    a();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgInfo]);

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
        toast.success(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
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
  const transactionId = form.watch("transaction.transactionId");
  return {
    form,
    handleSubmit,
    isLoading,
    orgInfo,
    startDate,
    transaction: transaction?.data,
    transactionId,
  };
};

export default useAddEditOrgForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rcp";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { toast } from "sonner";
import { useAddEditOrgUserDialog } from "./useAddEditOrgUserDialog";
import { createOrgUser, OrgUserValues } from "@/zodSchema/orgUser";

const createApi = client.api.main.org.users[":doctorWebName"]["$post"];
type CreateRequestType = InferRequestType<typeof createApi>;
type CreateResponseType = InferResponseType<typeof createApi, 201>;

const editApi = client.api.main.org.users[":doctorWebName"][":userId"]["$put"];
type EditRequestType = InferRequestType<typeof editApi>;
type EditResponseType = InferResponseType<typeof editApi, 200>;

const useAddEditOrgUserForm = () => {
  const { onClose, orgUserInfo } = useAddEditOrgUserDialog();
  const queryClient = useQueryClient();

  const getDefaultValues = (): OrgUserValues => {
    if (orgUserInfo?.type === "edit") {
      return {
        role: orgUserInfo.orgUserInfo.role || "RECEPTIONIST",
        name: orgUserInfo.orgUserInfo.name || "",
        phoneNumber: orgUserInfo.orgUserInfo.phoneNumber || "+91",
        // userOrgId: orgUserInfo.orgUserInfo.userOrgId || "",
      };
    }
    return {
      role: "RECEPTIONIST",
      name: "",
      phoneNumber: "+91",
      // userOrgId: "",
    };
  };

  // Initialize the form with react-hook-form
  const form = useForm<OrgUserValues>({
    resolver: zodResolver(createOrgUser),
    defaultValues: getDefaultValues(),
  });

  const { mutate, isPending } = useMutation<
    CreateResponseType | EditResponseType,
    Error,
    CreateRequestType | EditRequestType
  >({
    mutationFn: async ({ json, param }) => {
      if (orgUserInfo?.type === "edit") {
        const res = await editApi({
          json,
          param: {
            doctorWebName: orgUserInfo?.orgUserInfo.webName,
            userId: orgUserInfo?.orgUserInfo.userId,
          },
        });
        if (!res.ok) throw res;

        const data = await res.json();

        return data;
      }
      const res = await createApi({
        json,
        param,
      });
      if (!res.ok) throw res;

      const data = await res.json();

      return data;
    },
    onError: async (err) => {
      const error = await getReadableErrorMessage(err);
      toast.error(error);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["users", orgUserInfo?.orgUserInfo.webName],
      });
      setTimeout(() => {
        onClose();
      }, 0);
    },
  });

  // Form submission handler
  function handleSubmit(data: OrgUserValues) {
    console.log({ data });
    if (!orgUserInfo?.orgUserInfo.webName)
      return toast.error("Something went wrong. Please try again later");

    if (orgUserInfo.type === "create") {
      mutate({
        json: {
          role: data.role,
          name: data.name,
          phoneNumber: data.phoneNumber,
          // userOrgId: data.userOrgId,
        },
        param: {
          doctorWebName: orgUserInfo?.orgUserInfo.webName,
        },
      });
    } else {
      mutate({
        json: {
          role: data.role,
          name: data.name,
          phoneNumber: data.phoneNumber,
          // userOrgId: data.userOrgId,
        },
        param: {
          doctorWebName: orgUserInfo?.orgUserInfo.webName,
          userId: orgUserInfo?.orgUserInfo.userId,
        },
      });
    }

    if (orgUserInfo?.type === "create") {
    }
  }

  const isLoading = form.formState.isSubmitting || isPending;

  return {
    form,
    handleSubmit,
    isLoading,
  };
};

export default useAddEditOrgUserForm;

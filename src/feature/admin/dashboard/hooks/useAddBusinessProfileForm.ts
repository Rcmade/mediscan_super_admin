import useWebName from "@/hooks/useWebName";
import { client } from "@/lib/rcp";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import {
  BusinessProfileFormValues,
  createOrgBusinessProfile,
} from "@/zodSchema/organizationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const api =
  client.api.main.admin.dashboard.o[":orgName"]["business-profile"]["$post"];

type CreateOrgBusinessProfileResponse = InferResponseType<typeof api, 201>;
type CreateOrgBusinessProfileRequest = InferRequestType<typeof api>;

const useAddBusinessProfileForm = () => {
  const { webName } = useWebName();
  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(createOrgBusinessProfile),
    defaultValues: {
      category: undefined,
      address: {
        street1: "",
        street2: "",
        city: "",
        state: "",
        postalCode: "",
      },
      legalInfo: {
        pan: "",
        gst: "",
      },
    },
  });

  const { push } = useRouter();

  const { isPending, mutate } = useMutation<
    CreateOrgBusinessProfileResponse,
    Error,
    CreateOrgBusinessProfileRequest
  >({
    mutationFn: async (input) => {
      const response = await api(input);
      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      push(`/admin/dashboard/organization/o/${data.doctorWebName}/bank-info`);
    },
    onError: (err) => {
      const error = getReadableErrorMessage(err);
      toast.error(error);
    },
  });
  // Form submission handler
  function onSubmit(values: BusinessProfileFormValues) {
    mutate({
      json: values,
      param: {
        orgName: webName,
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending,
  };
};

export default useAddBusinessProfileForm;

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import useAddEditAppointmentReasonsType from "./useAddEditAppointmentReasonTypeDialog";
import { getReadableErrorMessage } from "@/lib/utils/stringUtils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentReasonsTypeSchema,
  AppointmentReasonsTypeSchemaT,
} from "@/zodSchema/appointmentReasonsTypeSchema";
import useWebName from "@/hooks/useWebName";

const api =
  client.api.main.features["appointment-reasons"]["o"][":orgWebName"]["$post"];

type AddEditAppointmentReasonResponseT = InferResponseType<typeof api, 200>;
type AddEditAppointmentReasonRequestT = InferRequestType<typeof api>;

const useAddEditAppointmentReasonTypeForm = () => {
  const { onClose, appointmentReason } = useAddEditAppointmentReasonsType();

  const { webName } = useWebName();
  const queryClient = useQueryClient();
  const getDefaultValues = (): Partial<AppointmentReasonsTypeSchemaT> => {
    if (appointmentReason?.type === "edit") {
      return {
        amount: appointmentReason.appointmentReason.amount
          ? +appointmentReason.appointmentReason.amount
          : 0,
        name: appointmentReason.appointmentReason.name || "",
        appointmentReasonsTypeId:
          appointmentReason.appointmentReason.reasonId || "",
      };
    }
    return {
      amount: 0,
      name: "",
    };
  };

  const form = useForm<AppointmentReasonsTypeSchemaT>({
    resolver: zodResolver(appointmentReasonsTypeSchema),
    defaultValues: getDefaultValues(),
  });

  const mutation = useMutation<
    AddEditAppointmentReasonResponseT,
    Error,
    AddEditAppointmentReasonRequestT
  >({
    mutationFn: async (input) => {
      const res = await api(input);
      if (!res.ok) {
        throw res;
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["viewAppointmentReasonType", webName],
      });
      setTimeout(() => {
        onClose();
      }, 0);
    },
    onError: (err) => {
      const error = getReadableErrorMessage(err);
      toast.error(error);
    },
  });

  const onSubmit = (values: AppointmentReasonsTypeSchemaT) => {
    mutation.mutate({
      json: {
        amount: values.amount,
        name: values.name,
        appointmentReasonsTypeId: values.appointmentReasonsTypeId,
      },
      param: {
        orgWebName: webName,
      },
    });
  };

  return { mutation, form, onSubmit };
};

export default useAddEditAppointmentReasonTypeForm;

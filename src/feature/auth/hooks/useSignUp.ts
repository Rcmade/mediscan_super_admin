import { client } from "@/lib/rcp";
import { signUpSchema, SignUpSchemaT } from "@/zodSchema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const api = client.api.main.auth.signup.$post;
type ResponseType = InferResponseType<typeof api, 201>;
type RequestType = InferRequestType<typeof api>;

const useSignUp = () => {
  const id = "signup";
  const { push } = useRouter();
  const form = useForm<SignUpSchemaT>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      phoneNumber: "+91",
    },
  });

  const { mutate, isPending, data } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const res = await api({ json });
      if (!res.ok) {
        throw await res.json();
      }
      const data = await res.json();
      toast.success(data.message, {
        id,
      });

      return data;
    },
    onSuccess: () => {
      push("/auth/login");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to signup", {
        id,
      });
    },
  });

  const onSubmit = (values: SignUpSchemaT) => {
    mutate({ json: values });
  };
  return { form, mutate, isLoading: isPending, data, onSubmit };
};

export default useSignUp;

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import useAddEditAppointmentReasonsType from "./useAddEditAppointmentReasonTypeDialog";
import useAddEditAppointmentReasonTypeForm from "../../hooks/useAddEditAppointmentReasonTypeForm";
import { NumberInput } from "@/components/ui/number-input";
import useAddEditAppointmentReasonsTypeDialog from "../../hooks/useAddEditAppointmentReasonTypeDialog";

const AddEditAppointmentReasonTypeForm = () => {
  const { mutation, form, onSubmit } = useAddEditAppointmentReasonTypeForm();
  // const { appointmentReasonType, isEdit, orgWebName } =
  //   useAddEditAppointmentReasonsType();
  const appointmentReason = useAddEditAppointmentReasonsTypeDialog(
    (s) => s.appointmentReason,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter reason name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <NumberInput
                  value={value}
                  onValueChange={(e) => onChange(e)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={mutation.isPending}>
            {appointmentReason?.type === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEditAppointmentReasonTypeForm;

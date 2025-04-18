"use client";
import React, { useEffect, useState } from "react";
import useAddEditTransactionForm from "../../hooks/useAddEditTransactionForm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";

const AddEditTransactionForm = () => {
  const { form, isPending, onSubmit, transactionInfo } =
    useAddEditTransactionForm();
  const paidAmount = form.watch("paid");
  const totalAmount = form.watch("total");
  const [isPaidAmountValid, setIsPaidAmountValid] = useState(true);

  useEffect(() => {
    if (paidAmount === undefined || totalAmount === undefined) return;
    if (paidAmount > totalAmount) {
      if (isPaidAmountValid) {
        setIsPaidAmountValid(false);
      }
      return;
    }
    if (!isPaidAmountValid) {
      setIsPaidAmountValid(true);
    }
    form.setValue("due", totalAmount - paidAmount);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidAmount, totalAmount]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="total"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <NumberInput
                  disabled={isPending}
                  value={value}
                  onValueChange={(e) => onChange(e)}
                  {...rest}
                />
              </FormControl>
              <FormDescription>
                The total amount of the transaction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paid"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Paid Amount</FormLabel>
              <FormControl>
                <NumberInput
                  disabled={isPending}
                  value={value}
                  onValueChange={(e) => {
                    onChange(e);
                  }}
                  {...rest}
                />
              </FormControl>
              <FormDescription>
                {isPaidAmountValid ? (
                  "The amount that has been paid"
                ) : (
                  <span className="text-destructive">
                    Something is wrong, paid amount is greater than total amount
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due"
          render={({ field: { value, onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Due Amount</FormLabel>
              <FormControl>
                <NumberInput
                  disabled={isPending}
                  value={value}
                  onValueChange={(e) => onChange(e)}
                  {...rest}
                />
              </FormControl>
              <FormDescription>The amount that is due</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} spinner>
          {transactionInfo?.type === "edit"
            ? "Update Transaction"
            : "Create Transaction"}
        </Button>
      </form>
    </Form>
  );
};

export default AddEditTransactionForm;

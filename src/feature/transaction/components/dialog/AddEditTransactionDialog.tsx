"use client";
import React from "react";
import useAddEditTransactionDialog from "../../hooks/useAddEditTransactionDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddEditTransactionForm from "../form/AddEditTransactionForm";

const AddEditTransactionDialog = () => {
  const { isOpen, onClose, transactionInfo } = useAddEditTransactionDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {transactionInfo?.type === "edit"
              ? "Edit Transaction"
              : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {transactionInfo?.type === "edit"
              ? "Are you sure you want to edit this transaction?"
              : "Fill in the details to add a new transaction."}
          </DialogDescription>
        </DialogHeader>
        <AddEditTransactionForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTransactionDialog;

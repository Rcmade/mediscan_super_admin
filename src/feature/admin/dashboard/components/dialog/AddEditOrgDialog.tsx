import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddEditOrgDialog } from "../../hooks/useAddEditOrgDialog";
import AddEditOrgForm from "../form/AddEditOrgForm";

const AddEditOrgDialog = () => {
  const { isOpen, onClose, orgInfo } = useAddEditOrgDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {orgInfo?.type === "edit"
              ? "Edit Organization"
              : "Add Organization"}
          </DialogTitle>
          <DialogDescription>
            {orgInfo?.type === "edit"
              ? "Are you sure you want to edit this organization?"
              : "Fill in the details to add a new organization."}
          </DialogDescription>
        </DialogHeader>
        <AddEditOrgForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditOrgDialog;

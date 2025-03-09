import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useAddEditOrgUserDialog } from "../../hooks/useAddEditOrgUserDialog";
import AddEditOrgUserForm from "../form/AddEditOrgUserForm";

const AddEditOrgUserDialog = () => {
  const { isOpen, onClose, orgUserInfo } = useAddEditOrgUserDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {orgUserInfo?.type === "edit" ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription>
            {orgUserInfo?.type === "edit"
              ? "Edit the user information"
              : "Add a new user"}
          </DialogDescription>
        </DialogHeader>
        {isOpen && <AddEditOrgUserForm />}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditOrgUserDialog;

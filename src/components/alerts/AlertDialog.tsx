"use client";
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAlertDialogStore } from "@/hooks/useAlertDialog";

export function AlertDialog() {
  const {
    isOpen,
    title,
    description,
    confirmLabel,
    cancelLabel,
    isLoading,
    onConfirm,
    onCancel,
    closeDialog,
  } = useAlertDialogStore();

  const handleCancel = () => {
    onCancel();
    closeDialog();
  };

  return (
    <AlertDialogPrimitive open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <Button spinner onClick={onConfirm} disabled={isLoading}>
            {isLoading ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
}

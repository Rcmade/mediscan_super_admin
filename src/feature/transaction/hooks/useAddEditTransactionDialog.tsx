import { create } from "zustand";
import { ViewTransactionByIdResponseType } from "./useViewTransactionById";

export type AddEditTransactionDialogT =
  | {
      type: "create";
      webName: string;
    }
  | {
      type: "edit";
      transactionInfo: ViewTransactionByIdResponseType;
      webName: string;
    };

type UseAddEditTransactionDialogT = {
  onOpen: (transactionInfo: AddEditTransactionDialogT) => void;
  onClose: () => void;
  transactionInfo?: AddEditTransactionDialogT;
  isOpen: boolean;
};

const useAddEditTransactionDialog = create<UseAddEditTransactionDialogT>(
  (set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false, transactionInfo: undefined }),
    onOpen: (transactionInfo) => {
      set({ isOpen: true, transactionInfo });
    },
  }),
);

export default useAddEditTransactionDialog;

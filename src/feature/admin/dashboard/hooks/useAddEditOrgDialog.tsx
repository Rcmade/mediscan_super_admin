import { UseGetOrgByWebNameResponseT } from "@/feature/organization/hooks/useGetOrgByWebName";
import { create } from "zustand";

export type AddEditDepartmentDialogT =
  | {
      type: "create";
    }
  | {
      type: "edit";
      orgInfo: UseGetOrgByWebNameResponseT;
      webName: string;
    };

type UseAddEditOrgDialogT = {
  onOpen: (orgInfo: AddEditDepartmentDialogT) => void;
  onClose: () => void;
  orgInfo?: AddEditDepartmentDialogT;
  isOpen: boolean;
};

export const useAddEditOrgDialog = create<UseAddEditOrgDialogT>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, orgInfo: undefined }),
  onOpen: (orgInfo) => {
    set({ isOpen: true, orgInfo });
  },
}));

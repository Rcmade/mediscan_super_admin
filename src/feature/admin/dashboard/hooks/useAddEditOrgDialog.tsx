import { UseGetOrgByWebNameResponseT } from "@/feature/organization/hooks/useGetOrgByWebName";
import { create } from "zustand";

export type AddEdiOrgDialogT =
  | {
      type: "create";
    }
  | {
      type: "edit";
      orgInfo: UseGetOrgByWebNameResponseT;
      webName: string;
    };

type UseAddEditOrgDialogT = {
  onOpen: (orgInfo: AddEdiOrgDialogT) => void;
  onClose: () => void;
  orgInfo?: AddEdiOrgDialogT;
  isOpen: boolean;
};

export const useAddEditOrgDialog = create<UseAddEditOrgDialogT>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, orgInfo: undefined }),
  onOpen: (orgInfo) => {
    set({ isOpen: true, orgInfo });
  },
}));

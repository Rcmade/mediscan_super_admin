import { OrgUserValues } from "@/zodSchema/orgUser";
import { create } from "zustand";

export type AddEdiOrgUserDialogT =
  | {
      type: "create";
      orgUserInfo: { webName: string };
    }
  | {
      type: "edit";
      orgUserInfo: Partial<OrgUserValues> & { webName: string; userId: string };
    };

type UseAddEditOrgUserT = {
  onOpen: (orgUserInfo: AddEdiOrgUserDialogT) => void;
  onClose: () => void;
  orgUserInfo?: AddEdiOrgUserDialogT;
  isOpen: boolean;
};

export const useAddEditOrgUserDialog = create<UseAddEditOrgUserT>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, orgUserInfo: undefined }),
  onOpen: (orgUserInfo) => {
    set({ isOpen: true, orgUserInfo });
  },
}));

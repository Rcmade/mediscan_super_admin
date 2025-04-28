import { create } from "zustand";
import { ViewAppointmentReasonTypeResponse } from "./useViewAppointmentReasonType";

export type AddEditAppointmentReasonsTypeDialogT =
  | {
      type: "create";
      webName: string;
    }
  | {
      type: "edit";
      appointmentReason: ViewAppointmentReasonTypeResponse["appointmentReasons"][number];
      webName: string;
    };

type UseAddEditAppointmentReasonsTypeDialogT = {
  onOpen: (appointmentReason: AddEditAppointmentReasonsTypeDialogT) => void;
  onClose: () => void;
  appointmentReason?: AddEditAppointmentReasonsTypeDialogT;
  isOpen: boolean;
};

const useAddEditAppointmentReasonsTypeDialog =
  create<UseAddEditAppointmentReasonsTypeDialogT>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen: false, appointmentReason: undefined }),
    onOpen: (appointmentReason) => {
      set({ isOpen: true, appointmentReason });
    },
  }));

export default useAddEditAppointmentReasonsTypeDialog;

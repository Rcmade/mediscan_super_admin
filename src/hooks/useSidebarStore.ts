import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  isMobileOpen: boolean;
  toggleSidebar: (isMobile: boolean) => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isMobileOpen: false,
  toggleSidebar: (isMobile: boolean) =>
    set((state) => ({
      isOpen: isMobile ? state.isOpen : !state.isOpen,
      isMobileOpen: isMobile ? !state.isMobileOpen : state.isMobileOpen,
    })),
}));

export default useSidebarStore;

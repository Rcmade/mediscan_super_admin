import {
  SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/feature/admin/dashboard/components/sidebar/DashboardSidebar";
import { Children } from "@/types";
import React from "react";

const Layout = ({ children }: Children) => {
  return (
    <SidebarProvider className="relative">
      <DashboardSidebar />
      <SidebarInset>
        {/* <div className="flex justify-end px-4 my-2 mr-3" >
          <SidebarTrigger className=""/>
        </div> */}
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;

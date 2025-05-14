import {
  SidebarInset,
  SidebarProvider,
  // SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/feature/admin/dashboard/components/sidebar/DashboardSidebar";
import Title from "@/feature/organization/components/sections/Title";
import { Children } from "@/types";
import React from "react";

const Layout = ({ children }: Children) => {
  return (
    <SidebarProvider className="relative">
      <Title />

      <DashboardSidebar />
      <SidebarInset>
        {/* <div className="flex justify-end px-4 my-2 mr-3" >
          <SidebarTrigger className=""/>
        </div> */}
        <div className="flex flex-1 flex-col gap-4 overflow-x-auto pt-0 sm:p-2 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;

"use client";

import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import DashboardSidebarNav from "./DashboardSidebarNav";
// import LogoButton from "@/components/buttons/LogoButton";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="absolute" {...props}>
      {/* <SidebarHeader className="overflow-x-hidden">
        <LogoButton />
      </SidebarHeader> */}
      <SidebarContent>
        <DashboardSidebarNav />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

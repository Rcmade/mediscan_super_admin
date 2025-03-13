"use client";

import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { dashboardContent } from "@/content/dashboardContent";
import useGetUserOrg from "@/feature/organization/hooks/useGetUserOrg";
import useWebName from "@/hooks/useWebName";
import { useMemo } from "react";

function DashboardSidebarNav() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const { data: org } = useGetUserOrg();
  const { webName } = useWebName();

  // Memoize the filtered top navigation menu
  const filteredTopNavMenu = useMemo(() => {
    if (!user) return [];
    return dashboardContent.topNavMenu.filter(
      (item) =>
        item.accessBy.includes(user.role) ||
        (webName && user.role === "SUPER_ADMIN"),
    );
  }, [user, webName]);

  // Reusable function to render a menu button
  const renderMenuButton = (
    item: (typeof dashboardContent.topNavMenu)[number],
    href?: string, // Optional href to override the default item.url
  ) => (
    <SidebarMenuButton
      key={item.title}
      tooltip={item.title}
      className={cn(
        "relative !py-5 font-normal hover:!bg-primary/20 hover:!text-primary",
        pathname === (href || item.url) &&
          "!bg-primary/20 !font-bold !text-primary",
      )}
    >
      {item.icon && <item.icon className="!size-6" />}
      <span>{item.title}</span>
      <Link
        href={href || item.url} // Use the provided href or fallback to item.url
        className="absolute inset-0"
        aria-label={item.title}
      />
    </SidebarMenuButton>
  );

  return (
    <SidebarGroup>
      <div
        className="flex flex-col gap-1"
        key={`top-nav-${user?.id}-${user?.role}`}
      >
        {/* Render super admin only menu */}
        {user && user?.role === "SUPER_ADMIN" && (
          <>
            {dashboardContent.superAdminOnlyMenu.map((item) =>
              renderMenuButton(item),
            )}
            <SidebarSeparator />
          </>
        )}

        {/* Render filtered top navigation menu */}
        {user &&
          filteredTopNavMenu.map((item) =>
            renderMenuButton(
              item,
              `/admin/dashboard/organization/o/${org?.organizations?.webName || webName}${item.url}`,
            ),
          )}
      </div>
    </SidebarGroup>
  );
}

export default DashboardSidebarNav;

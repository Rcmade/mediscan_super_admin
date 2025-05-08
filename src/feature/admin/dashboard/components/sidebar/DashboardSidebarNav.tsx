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
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

function DashboardSidebarNav() {
  const user = useCurrentUser();
  const pathname = usePathname();
  const { data: org } = useGetUserOrg();
  const { webName } = useWebName();

  // Memoize the filtered top navigation menu
  const filteredTopNavMenu = useMemo(() => {
    if (!user) return [];
    return dashboardContent.topNavMenu.filter((item) => {
      return (
        item.accessBy.includes(user.role) ||
        (webName && user.role === "SUPER_ADMIN")
      );
    });
  }, [user, webName]);

  const filteredBottomNavMenu = useMemo(() => {
    if (!user) return [];
    return dashboardContent.bottomNavMenu.filter((item) => {
      return (
        item.accessBy.includes(user.role) ||
        (webName && user.role === "SUPER_ADMIN")
      );
    });
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

  const orgBaseUrl = `/admin/dashboard/organization/o`;

  return (
    <SidebarGroup>
      <div
        className="flex flex-col gap-1"
        key={`top-nav-${user?.id}-${user?.role}`}
      >
        {/* Render super admin only menu */}

        <div
          className="flex flex-col gap-1"
          key={`top-nav${user?.id}-${user?.role}`}
        >
          {user && user?.role === "SUPER_ADMIN" && (
            <>
              {dashboardContent.superAdminOnlyMenu.map((item) =>
                renderMenuButton(item),
              )}
              <SidebarSeparator />
            </>
          )}
        </div>

        {/* Render filtered top navigation menu */}
        {user &&
          filteredTopNavMenu.map((item) =>
            renderMenuButton(
              item,
              `${orgBaseUrl}/${org?.organizations?.webName || webName}${item.url}`,
            ),
          )}

        <SidebarMenu className="my-1" key={`submenu-${user?.id}-${user?.role}`}>
          {user &&
            dashboardContent.navMenuWithSubmenu.map((item) => {
              const filteredItems = item.items?.filter((sub) => {
                return (
                  sub.accessBy.includes(user?.role || "USER") ||
                  (webName && user.role === "SUPER_ADMIN")
                );
              });

              if (!filteredItems?.length) return null;

              return (
                <Collapsible
                  key={`collapsible-${item.title}`}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "relative !py-5 font-normal hover:!bg-primary/20 hover:!text-primary",
                          pathname.startsWith(item.url) &&
                            "!bg-primary/20 !font-bold !text-primary",
                        )}
                      >
                        {item.icon && <item.icon className="!size-6" />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {filteredItems.map((sub) => (
                          <SidebarMenuSubItem key={`sub-${sub.title}`}>
                            <SidebarMenuButton
                              tooltip={sub.title}
                              className={cn(
                                "relative font-normal hover:!text-primary",
                                pathname ===
                                  `${orgBaseUrl}/${
                                    org?.organizations?.webName || webName
                                  }${sub.url}` && "!font-bold !text-primary",
                              )}
                            >
                              <span>{sub.title}</span>
                              <Link
                                href={`${orgBaseUrl}/${
                                  org?.organizations?.webName || webName
                                }${sub.url}`}
                                className="absolute inset-0"
                              />
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
        </SidebarMenu>

        {/* Render filtered top navigation menu */}
        {user &&
          filteredBottomNavMenu.map((item) =>
            renderMenuButton(
              item,
              `${orgBaseUrl}/${org?.organizations?.webName || webName}${item.url}`,
            ),
          )}
      </div>
    </SidebarGroup>
  );
}

export default DashboardSidebarNav;

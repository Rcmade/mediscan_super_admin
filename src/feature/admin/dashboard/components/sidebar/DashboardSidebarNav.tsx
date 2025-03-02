"use client";

// import { ChevronRight } from "lucide-react";

// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  //   SidebarMenu,
  SidebarMenuButton,
  //   SidebarMenuItem,
  //   SidebarMenuSub,
  //   SidebarMenuSubItem,
} from "@/components/ui/sidebar";
// import useCurrentUser from "@/features/auth/hooks/useCurrentUser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { dashboardContent } from "@/content/dashboardContent";

function DashboardSidebarNav() {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <div
        className="flex flex-col gap-1"
        key={`top-nav${user?.id}-${user?.role}`}
      >
        {user &&
          dashboardContent.topNavMenu
            .filter((i) => i.accessBy.includes(user?.role))
            .map((item) => (
              <SidebarMenuButton
                key={item.title}
                tooltip={item.title}
                className={cn(
                  "relative !py-5 font-normal hover:!bg-primary/20 hover:!text-primary",
                  pathname === item.url &&
                    "!bg-primary/20 !font-bold !text-primary",
                )}
              >
                {item.icon && <item.icon className="!size-6" />}
                <span>{item.title}</span>
                <Link href={`${item.url}`} className="absolute inset-0"></Link>
              </SidebarMenuButton>
            ))}
      </div>
      {/* <SidebarMenu className="my-1" key={`top-subnav${user?.id}-${user?.role}`}>
        {dashboardContent.navMenuWithSubmenu.map((item) => {
          return (
            <Collapsible
              key={item.title}
              asChild
              // defaultOpen={item?.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    key={item.title}
                    tooltip={item.title}
                    className={cn(
                      "relative !py-5 font-normal hover:!bg-primary/20 hover:!text-primary",
                      pathname === item.url &&
                        "!bg-primary/20 !font-bold !text-primary",
                    )}
                  >
                    {item.icon && <item.icon className="!size-6" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {user?.role && (
                    <SidebarMenuSub>
                      {item.items
                        ?.filter((i) => i.accessBy.includes(user?.role))
                        .map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuButton
                              key={subItem.title}
                              tooltip={subItem.title}
                              className={cn(
                                "relative font-normal hover:!text-primary",
                                pathname === subItem.url &&
                                  "!font-bold !text-primary",
                              )}
                            >
                              <span>{subItem.title}</span>
                              <Link
                                href={`${subItem.url}`}
                                className="absolute inset-0"
                              ></Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  )}
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu> */}
    </SidebarGroup>
  );
}

export default DashboardSidebarNav;

import { UserRole } from "@/lib/db/schema";
import { Frame, Home, type LucideIcon, PieChart, Plane } from "lucide-react";

type SubMenu = {
  title: string;
  url: string;
  accessBy: Partial<UserRole>[];
};

type NavMenuWithSubmenu = {
  title: string;
  url: string;
  icon: LucideIcon;
  items: SubMenu[];
};

const navMenuWithSubmenu: NavMenuWithSubmenu[] = [
  {
    title: "Leaves",
    url: "#",
    icon: Plane,
    items: [
      {
        title: "View Leaves",
        url: "/dashboard/leaves",
        accessBy: ["RECEPTIONIST", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

type TopNavT = SubMenu & { icon: LucideIcon };

export const topNavMenu: TopNavT[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    accessBy: ["SUPER_ADMIN", "RECEPTIONIST", "ADMIN"],
    icon: Home,
  },
  {
    title: "Organization",
    url: "/admin/dashboard/organization",
    accessBy: ["SUPER_ADMIN"],
    icon: Frame,
  },

  //   {
  //     title: "Department",
  //     url: "/dashboard/department",
  //     icon: Network,
  //     accessBy: ["Admin", "HR"],
  //   },
] as const;
export const dashboardContent = {
  navMenuWithSubmenu,
  topNavMenu,
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
} as const;
export type DashboardContentT = typeof dashboardContent;

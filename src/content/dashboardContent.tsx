import { UserRole } from "@/lib/db/schema";
import {
  Calendar,
  Frame,
  Home,
  Layout,
  type LucideIcon,
  PieChart,
  Plane,
  Tv,
  Users,
} from "lucide-react";

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
    accessBy: ["SUPER_ADMIN"],
    icon: Home,
  },

  {
    title: "Organization",
    url: "/admin/dashboard/organization",
    accessBy: ["SUPER_ADMIN"],
    icon: Home,
  },

  {
    title: "Organization",
    url: "/",
    accessBy: ["ADMIN"],
    icon: Layout,
  },

  {
    title: "Appointments",
    url: "/token/search",
    accessBy: ["ADMIN", "RECEPTIONIST"],
    icon: Calendar,
  },

  {
    title: "Display",
    url: "/token/display",
    icon: Tv,
    accessBy: ["ADMIN", "RECEPTIONIST"],
  },

  {
    title: "Users",
    url: "/users",
    accessBy: ["ADMIN", "RECEPTIONIST"],
    icon: Users,
  },
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

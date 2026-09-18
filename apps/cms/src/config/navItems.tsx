import { DashboardView } from "@/types";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  CalendarDays,
  Settings,
  Mail,
} from "lucide-react";

import { GoPeople } from "react-icons/go";
import { LuClipboardCheck } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";

export const navItems = [
  {
    id: "overview" as DashboardView,
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  // blogs
  {
    id: "blogs" as DashboardView,
    path: "/blogs",
    label: "Blogs",
    icon: FileText,
  },
  // project
  {
    id: "projects" as DashboardView,
    path: "/projects",
    label: "Projects",
    icon: FolderOpen,
  },
  // contact
  {
    id: "contact" as DashboardView,
    path: "/contact",
    label: "Contact",
    icon: MdOutlineMessage,
  },
  // schedule
  {
    id: "Schedule" as DashboardView,
    path: "/schedule",
    label: "Schedule",
    icon: CalendarDays,
  },
  // team
  {
    id: "Team-editor" as DashboardView,
    path: "/team",
    label: "Members",
    icon: GoPeople,
  },
  // tasks
  {
    id: "task" as DashboardView,
    path: "/tasks",
    label: "Task",
    icon: LuClipboardCheck,
  },
  {
    id: "settings" as DashboardView,
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

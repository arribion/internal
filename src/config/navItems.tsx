import { DashboardView } from "@/types";
import { LayoutDashboard, FileText, FolderOpen, PlusCircle, Settings } from "lucide-react";

export const navItems = [
  {
    id: "overview" as DashboardView,
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  // blogs
  { id: "blogs" as DashboardView, path: "/blogs", label: "Blogs", icon: FileText },
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
    icon: PlusCircle,
  },
  // schedule
  {
    id: "Schedule" as DashboardView,
    path: "/schedule",
    label: "Schedule",
    icon: PlusCircle,
  },
  // team
  {
    id: "Team-editor" as DashboardView,
    path: "/team",
    label: "Members",
    icon: PlusCircle,
  },
  // tasks
  {
    id: "task" as DashboardView,
    path: "/tasks",
    label: "Task",
    icon: PlusCircle,
  },
  {
    id: "settings" as DashboardView,
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];
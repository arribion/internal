"use client";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  ExternalLink,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { DashboardView } from "@/types";

interface SidebarProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    id: "overview" as DashboardView,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  // blogs
  { id: "blogs" as DashboardView, label: "All Blogs", icon: FileText },
  { id: "editor" as DashboardView, label: "New Blog", icon: PlusCircle },
  // project
  { id: "projects" as DashboardView, label: "Projects", icon: FolderOpen },
  {
    id: "project-editor" as DashboardView,
    label: "New Project",
    icon: PlusCircle,
  },
  // contact
  {
    id: "contact" as DashboardView,
    label: "Contact",
    icon: PlusCircle,
  },
  // schedule
  {
    id: "Schedule" as DashboardView,
    label: "Pending Schedule",
    icon: PlusCircle,
  },
  {
    id: "Schedule" as DashboardView,
    label: "Manage Schedule",
    icon: PlusCircle,
  },

  // team
  {
    id: "Team-editor" as DashboardView,
    label: "New Member",
    icon: PlusCircle,
  },
  { id: "team" as DashboardView, label: "Team", icon: FolderOpen },
  // tasks
  {
    id: "task" as DashboardView,
    label: "Task",
    icon: PlusCircle,
  },
];

export default function Sidebar({ currentView, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#0a0a0f] border-r border-white/10 z-50 transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
          A
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">Arribion</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] text-gray-600 uppercase tracking-widest px-3 mb-2">Content</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-linear-to-r from-violet-500/20 to-fuchsia-500/10 text-white border border-violet-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`}
              />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* External link */}
      <div className="px-2 pb-2">
        <a
          href="https://arribion-0-2.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={18} className="shrink-0 text-gray-500" />
          {!collapsed && <span>View Site</span>}
        </a>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-white/10 text-gray-500 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}

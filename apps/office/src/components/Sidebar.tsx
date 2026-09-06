"use client";

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems } from "@/config/navItems";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-surface transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
          A
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold leading-tight text-text">
              Arribion
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-text-subtle">
              {user?.name ?? "Office"}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-text-subtle">
            Workspace
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "border-primary/30 bg-primary/10 text-text"
                    : "border-transparent text-text-muted hover:bg-bg-muted hover:text-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      isActive
                        ? "text-primary"
                        : "text-text-subtle group-hover:text-text-muted"
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-2 pb-2">
        <button
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-t border-border text-text-subtle transition-colors hover:text-text"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}

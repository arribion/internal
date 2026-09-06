import type { AppRole } from "@/types/office";

export const officeRoles: AppRole[] = ["admin", "editor", "sales", "support", "developer"];

export const roomAccess: Record<string, AppRole[]> = {
  home: ["admin", "editor", "sales", "support", "developer"],
  "booking-requests": ["admin", "sales", "support", "editor"],
  "call-sessions": ["admin", "sales", "support", "developer"],
  clients: ["admin", "sales", "support", "editor"],
  projects: ["admin", "editor", "developer", "sales"],
  tasks: ["admin", "editor", "support", "developer"],
  team: ["admin", "editor", "sales", "support", "developer"],
  activity: ["admin", "editor", "sales", "support", "developer"],
};

export function userRolesMatchRoom(userRoles: AppRole[] | undefined, room: string) {
  if (!userRoles?.length) return false;
  if (userRoles.includes("admin")) return true;
  return (roomAccess[room] ?? []).some((role) => userRoles.includes(role));
}

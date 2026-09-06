import { CalendarClock, ClipboardCheck, UserRound } from "lucide-react";

export const navItems = [
  { id: "tasks", path: "/tasks", label: "Tasks", icon: ClipboardCheck },
  {
    id: "call-bookings",
    path: "/call-bookings",
    label: "Call Requests",
    icon: CalendarClock,
  },
  { id: "profile", path: "/profile", label: "Profile", icon: UserRound },
];

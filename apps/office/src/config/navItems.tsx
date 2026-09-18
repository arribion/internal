import {
  Antenna,
  Archive,
  CalendarClock,
  CalendarDays,
  ChartScatter,
  ClipboardCheck,
  LayoutDashboard,
  LayoutList,
  Mails,
  UserRound,
  UserRoundArrowLeft,
  UsersRound
} from "lucide-react";

export const navItems = [
  {
    id: "overview",
    path: "/overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "members",
    path: "/members",
    label: "Members",
    icon: UsersRound,
  },
  {
    id: "tasks",
    path: "/tasks",
    label: "Tasks",
    icon: LayoutList,
  },
  {
    id: "todo",
    path: "/todo",
    label: "TO-DO",
    icon: ClipboardCheck,
  },
  {
    id: "Archive",
    path: "/archive",
    label: "Archive",
    icon: Archive,
  },
  {
    id: "call-bookings",
    path: "/call-bookings",
    label: "Call Requests",
    icon: CalendarClock,
  },
  {
    id: "Attendance",
    path: "/attendance",
    label: "Attendance",
    icon: ChartScatter,
  },
  {
    id: "calender",
    path: "/calender",
    label: "Calender",
    icon: CalendarDays,
  },
  {
    id: "assignment",
    path: "/assignment",
    label: "Assignment",
    icon: UserRoundArrowLeft,
  },
  {
    id: "Newsletter",
    path: "/newsletter",
    label: "NewsLetter",
    icon: Mails,
  },
  {
    id: "profile",
    path: "/profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "cms",
    path: "https://cms.arribion.com/",
    label: "CMS",
    icon: Antenna,
  },
];

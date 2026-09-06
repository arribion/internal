import { CalendarDays, ClipboardList, Clock3 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <nav
        className="flex gap-1 overflow-x-auto border-b border-white/10"
        aria-label="Scheduling sections"
      >
        <ScheduleTab
          to="/schedule"
          icon={<CalendarDays size={16} />}
          label="Availability"
          end
        />
        <ScheduleTab
          to="/schedule/sessions"
          icon={<Clock3 size={16} />}
          label="Upcoming sessions"
        />
        <ScheduleTab
          to="/schedule/requests"
          icon={<ClipboardList size={16} />}
          label="Booking requests"
        />
      </nav>
      <Outlet />
    </div>
  );
}

function ScheduleTab({
  to,
  icon,
  label,
  end = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) =>
        `inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors ${isActive ? "border-sky-400 text-white" : "border-transparent text-gray-500 hover:text-gray-200"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

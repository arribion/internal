import { CalendarClock, X } from "lucide-react";
import { useState } from "react";
import { useCallSessions } from "@/hooks/queries/useCallSessions";
import { CallSession } from "@/types/schedule";

const sessionStatuses: CallSession["status"][] = [
  "available",
  "occupied",
  "in_progress",
  "completed",
  "cancelled",
  "expired",
];
const statusLabel = (status: string) => status.replaceAll("_", " ");
function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString([], { dateStyle: "medium" });
}
function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function statusClass(status: CallSession["status"]) {
  if (status === "available") return "bg-sky-400/10 text-sky-200";
  if (status === "completed") return "bg-emerald-400/10 text-emerald-300";
  if (status === "cancelled" || status === "expired")
    return "bg-rose-400/10 text-rose-300";
  return "bg-amber-400/10 text-amber-200";
}

export default function UpcomingSessionsPage() {
  const {
    data: sessions = [],
    isLoading,
    isError,
    refetch,
  } = useCallSessions();
  const [filter, setFilter] = useState<CallSession["status"] | "all">("all");
  const visible = sessions.filter(
    (session) => filter === "all" || session.status === filter,
  );
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-sky-400">
          Call scheduling
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Upcoming sessions
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Actual dated call occurrences generated from your availability.
        </p>
      </header>
      <div className="flex gap-2 overflow-x-auto border-y border-white/10 py-4">
        {(["all", ...sessionStatuses] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-lg border px-3 py-2 text-sm capitalize ${filter === status ? "border-sky-400/40 bg-sky-400/10 text-sky-200" : "border-white/10 text-gray-500 hover:text-white"}`}
          >
            {status === "all" ? "All" : statusLabel(status)}
          </button>
        ))}
      </div>
      {isLoading && <LoadingTable />}
      {isError && (
        <State
          icon={<X />}
          message="Upcoming sessions could not be loaded."
          action={() => refetch()}
        />
      )}
      {!isLoading && !isError && visible.length === 0 && (
        <State
          icon={<CalendarClock />}
          message={
            sessions.length
              ? "No sessions match this status."
              : "No upcoming sessions yet."
          }
        />
      )}
      {!isLoading && !isError && visible.length > 0 && (
        <div className="overflow-hidden border border-white/10 bg-[#111119] sm:rounded-xl">
          <div className="hidden grid-cols-[1.2fr_1.3fr_0.8fr] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-gray-600 md:grid">
            <span>Session date</span>
            <span>Time</span>
            <span>Status</span>
          </div>
          {visible.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
function SessionRow({ session }: { session: CallSession }) {
  return (
    <div className="grid gap-3 border-b border-white/5 px-5 py-4 last:border-0 md:grid-cols-[1.2fr_1.3fr_0.8fr] md:items-center md:gap-4">
      <div>
        <p className="text-sm font-medium text-white">
          {formatDate(session.startsAt)}
        </p>
        <p className="text-xs text-gray-600">Session ID: {session.id}</p>
      </div>
      <p className="text-sm text-gray-400">
        {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
      </p>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs capitalize ${statusClass(session.status)}`}
      >
        {statusLabel(session.status)}
      </span>
    </div>
  );
}
function LoadingTable() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
        />
      ))}
    </div>
  );
}
function State({
  icon,
  message,
  action,
}: {
  icon: React.ReactNode;
  message: string;
  action?: () => void;
}) {
  return (
    <div className="border border-dashed border-white/15 p-12 text-center sm:rounded-xl">
      <div className="mx-auto w-fit text-gray-600">{icon}</div>
      <p className="mt-4 text-sm text-gray-400">{message}</p>
      {action && (
        <button
          onClick={action}
          className="mt-3 text-sm text-sky-300 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

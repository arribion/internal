import { ClipboardList, Mail, X } from "lucide-react";
import { useState } from "react";
import { useCallRequests } from "@/hooks/queries/useCallRequests";
import { useCallSessions } from "@/hooks/queries/useCallSessions";
import { CallRequest } from "@/types/schedule";

const requestStatuses: CallRequest["status"][] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
];
const statusLabel = (status: string) => status.replaceAll("_", " ");
const projectLabel = (project: CallRequest["projectType"]) =>
  project.replaceAll("_", " ");
function formatCreatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString([], { dateStyle: "medium" });
}
function formatSessionTime(
  session: { startsAt: string; endsAt: string } | undefined,
) {
  if (!session) return "Session unavailable";
  const start = new Date(session.startsAt);
  const end = new Date(session.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return "Session time unavailable";
  return `${start.toLocaleDateString([], { dateStyle: "medium" })}, ${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}
function statusClass(status: CallRequest["status"]) {
  if (status === "confirmed" || status === "completed")
    return "bg-emerald-400/10 text-emerald-300";
  if (status === "cancelled" || status === "no_show")
    return "bg-rose-400/10 text-rose-300";
  return "bg-amber-400/10 text-amber-200";
}

export default function BookingRequestsPage() {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useCallRequests();
  const { data: sessions = [] } = useCallSessions();
  const [filter, setFilter] = useState<CallRequest["status"] | "all">("all");
  const [selected, setSelected] = useState<CallRequest | null>(null);
  const visible = requests.filter(
    (request) => filter === "all" || request.status === filter,
  );
  const sessionById = new Map(sessions.map((session) => [session.id, session]));
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-sky-400">
          Call scheduling
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Booking requests
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Customer requests linked to generated call sessions.
        </p>
      </header>
      <div className="flex gap-2 overflow-x-auto border-y border-white/10 py-4">
        {(["all", ...requestStatuses] as const).map((status) => (
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
        <RequestState
          message="Booking requests could not be loaded."
          action={() => refetch()}
        />
      )}
      {!isLoading && !isError && visible.length === 0 && (
        <RequestState
          message={
            requests.length
              ? "No requests match this status."
              : "No booking requests yet."
          }
        />
      )}
      {!isLoading && !isError && visible.length > 0 && (
        <div className="overflow-hidden border border-white/10 bg-[#111119] sm:rounded-xl">
          <div className="hidden grid-cols-[1.1fr_1.3fr_1fr_1.2fr_0.8fr] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-wider text-gray-600 md:grid">
            <span>Client</span>
            <span>Email</span>
            <span>Company</span>
            <span>Requested session</span>
            <span>Status</span>
          </div>
          {visible.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              sessionTime={formatSessionTime(
                sessionById.get(request.sessionId),
              )}
              onView={() => setSelected(request)}
            />
          ))}
        </div>
      )}
      {selected && (
        <RequestDetails
          request={selected}
          sessionTime={formatSessionTime(sessionById.get(selected.sessionId))}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
function RequestRow({
  request,
  sessionTime,
  onView,
}: {
  request: CallRequest;
  sessionTime: string;
  onView: () => void;
}) {
  return (
    <div className="grid gap-3 border-b border-white/5 px-5 py-4 last:border-0 md:grid-cols-[1.1fr_1.3fr_1fr_1.2fr_0.8fr] md:items-center md:gap-4">
      <div>
        <p className="text-sm font-medium text-white">{request.name}</p>
        <button
          onClick={onView}
          className="mt-1 text-xs text-sky-300 hover:text-sky-200"
        >
          View details
        </button>
      </div>
      <a
        href={`mailto:${request.email}`}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
      >
        <Mail size={14} /> {request.email}
      </a>
      <p className="text-sm text-gray-400">
        {request.company || "Not provided"}
      </p>
      <p className="text-sm text-gray-400">{sessionTime}</p>
      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs capitalize ${statusClass(request.status)}`}
      >
        {statusLabel(request.status)}
      </span>
    </div>
  );
}
function RequestDetails({
  request,
  sessionTime,
  onClose,
}: {
  request: CallRequest;
  sessionTime: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-lg space-y-5 border border-white/10 bg-[#111119] p-6 sm:rounded-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-sky-400">
              Request details
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {request.name}
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Requested {formatCreatedAt(request.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <Detail label="Email" value={request.email} />
          <Detail label="Company" value={request.company || "Not provided"} />
          <Detail
            label="Project type"
            value={projectLabel(request.projectType)}
          />
          <Detail label="Requested session" value={sessionTime} />
          <Detail label="Status" value={statusLabel(request.status)} />
        </dl>
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Discussion
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
            {request.discussion || "No discussion provided."}
          </p>
        </div>
        {request.internalNotes && (
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Internal notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
              {request.internalNotes}
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-gray-600">
        {label}
      </dt>
      <dd className="mt-1 break-words capitalize text-gray-300">{value}</dd>
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
function RequestState({
  message,
  action,
}: {
  message: string;
  action?: () => void;
}) {
  return (
    <div className="border border-dashed border-white/15 p-12 text-center sm:rounded-xl">
      <ClipboardList className="mx-auto text-gray-600" size={28} />
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

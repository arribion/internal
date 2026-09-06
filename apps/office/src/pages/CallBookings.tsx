import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import type { CallRequest } from "@shared/types/call-session";
import api from "@/config/api";
import { useCallRequests } from "@/hooks/queries/useCallRequests";

type RequestStatus = CallRequest["status"];
type StatusFilter = RequestStatus | "all";

const statuses: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All requests" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

const statusLabels: Record<RequestStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

const projectLabels: Record<CallRequest["projectType"], string> = {
  new_website: "New website",
  redesign: "Redesign",
  web_app: "Web app",
  performance_audit: "Performance audit",
  other: "Other",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function statusClass(status: RequestStatus) {
  if (status === "confirmed") return "bg-info/10 text-info";
  if (status === "completed") return "bg-success/10 text-success";
  if (status === "cancelled" || status === "no_show")
    return "bg-danger/10 text-danger";
  return "bg-warning/10 text-warning";
}

function matchesDate(request: CallRequest, month: string, date: string) {
  if (!month && !date) return true;
  const createdAt = new Date(request.createdAt);
  if (Number.isNaN(createdAt.getTime())) return false;
  if (
    month &&
    `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}` !==
      month
  )
    return false;
  return !date || createdAt.toISOString().slice(0, 10) === date;
}

export default function CallBookings() {
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useCallRequests();
  const [selected, setSelected] = useState<CallRequest | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [localRequests, setLocalRequests] = useState<CallRequest[]>([]);
  const allRequests = localRequests.length ? localRequests : requests;
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return allRequests.filter((request) => {
      const searchable =
        `${request.name} ${request.company ?? ""} ${request.email}`.toLowerCase();
      return (
        (!needle || searchable.includes(needle)) &&
        (status === "all" || request.status === status) &&
        matchesDate(request, month, date)
      );
    });
  }, [allRequests, date, month, search, status]);

  const updateRequest = useMutation({
    mutationFn: async (input: {
      id: string;
      status?: RequestStatus;
      internalNotes?: string | null;
    }) => {
      const response = await api.patch<{ data?: CallRequest }>(
        `/api/v1/call-requests/${input.id}`,
        input,
      );
      return response.data.data;
    },
    onSuccess: (updated) => {
      if (!updated) return;
      const source = localRequests.length ? localRequests : requests;
      setLocalRequests(
        source.map((request) =>
          request.id === updated.id ? updated : request,
        ),
      );
      setSelected(updated);
    },
  });

  const changeStatus = (request: CallRequest, nextStatus: RequestStatus) =>
    updateRequest.mutate({ id: request.id, status: nextStatus });

  return (
    <div className="mx-auto max-w-6xl animate-fade-in space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Operations inbox
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Call Requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Review incoming conversations, capture internal context, and keep
            each request moving.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="font-semibold text-text">{visible.length}</span>{" "}
          needing review
        </div>
      </header>
      <section className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, company, or email"
            className="w-full rounded-md border border-border bg-bg-muted py-2.5 pl-10 pr-4 text-sm text-text outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-text outline-none focus:border-primary"
          >
            {statuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-text-muted">
            <CalendarDays size={16} />
            <span className="sr-only">Filter by month</span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="bg-transparent text-text outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-md border border-border bg-bg-muted px-3 py-2 text-sm text-text-muted">
            <Clock3 size={16} />
            <span className="sr-only">Filter by specific date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-transparent text-text outline-none"
            />
          </label>
          {(search || status !== "all" || month || date) && (
            <button
              onClick={() => {
                setSearch("");
                setStatus("all");
                setMonth("");
                setDate("");
              }}
              className="px-2 py-2 text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>
      {isLoading && <LoadingState />}
      {isError && (
        <State
          icon={<RefreshCw size={28} />}
          message="Call requests could not be loaded."
          action={() => void refetch()}
          actionLabel="Try again"
        />
      )}
      {!isLoading && !isError && visible.length === 0 && (
        <State
          icon={<MessageSquareText size={28} />}
          message={
            allRequests.length
              ? "No requests match these filters."
              : "No call requests have arrived yet."
          }
        />
      )}
      {!isLoading && !isError && visible.length > 0 && (
        <section className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          {visible.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              onOpen={() => setSelected(request)}
              onStatusChange={changeStatus}
              isUpdating={updateRequest.isPending}
            />
          ))}
        </section>
      )}
      {selected && (
        <RequestDrawer
          request={selected}
          onClose={() => setSelected(null)}
          onStatusChange={changeStatus}
          onSaveNotes={(internalNotes) =>
            updateRequest.mutate({ id: selected.id, internalNotes })
          }
          isUpdating={updateRequest.isPending}
        />
      )}
    </div>
  );
}

function RequestRow({
  request,
  onOpen,
  onStatusChange,
  isUpdating,
}: {
  request: CallRequest;
  onOpen: () => void;
  onStatusChange: (request: CallRequest, status: RequestStatus) => void;
  isUpdating: boolean;
}) {
  return (
    <article className="group flex flex-col gap-4 p-5 transition-colors hover:bg-bg-muted/50 sm:flex-row sm:items-start sm:justify-between">
      <button onClick={onOpen} className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-semibold">{request.name}</h2>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(request.status)}`}
          >
            {statusLabels[request.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          {request.company || "Independent client"}{" "}
          <span className="mx-1 text-text-subtle">·</span> {request.email}
        </p>
        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-text-muted">
          {request.discussion || "No discussion provided."}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-subtle">
          <span>{projectLabels[request.projectType]}</span>
          <span>Received {formatDate(request.createdAt)}</span>
          {request.internalNotes && (
            <span className="flex items-center gap-1 text-primary">
              <MessageSquareText size={13} /> Internal note
            </span>
          )}
        </div>
      </button>
      <div className="flex shrink-0 items-center gap-2">
        <QuickActions
          request={request}
          onStatusChange={onStatusChange}
          isUpdating={isUpdating}
        />
        <button
          onClick={onOpen}
          aria-label={`Open request from ${request.name}`}
          className="rounded-md p-2 text-text-subtle hover:bg-bg-muted hover:text-text"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
}

function QuickActions({
  request,
  onStatusChange,
  isUpdating,
}: {
  request: CallRequest;
  onStatusChange: (request: CallRequest, status: RequestStatus) => void;
  isUpdating: boolean;
}) {
  if (request.status === "pending")
    return (
      <ActionButton
        label="Confirm"
        icon={<Check size={15} />}
        onClick={() => onStatusChange(request, "confirmed")}
        disabled={isUpdating}
      />
    );
  if (request.status === "confirmed")
    return (
      <ActionButton
        label="Complete"
        icon={<Check size={15} />}
        onClick={() => onStatusChange(request, "completed")}
        disabled={isUpdating}
      />
    );
  return (
    <span className="hidden items-center gap-1 text-xs text-text-subtle sm:flex">
      <MoreHorizontal size={16} /> Open for details
    </span>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {icon}
      {label}
    </button>
  );
}

function RequestDrawer({
  request,
  onClose,
  onStatusChange,
  onSaveNotes,
  isUpdating,
}: {
  request: CallRequest;
  onClose: () => void;
  onStatusChange: (request: CallRequest, status: RequestStatus) => void;
  onSaveNotes: (notes: string | null) => void;
  isUpdating: boolean;
}) {
  const [notes, setNotes] = useState(request.internalNotes ?? "");
  const canCancel =
    request.status === "pending" || request.status === "confirmed";
  const canNoShow = request.status === "confirmed";
  const canComplete = request.status === "confirmed";
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={`Call request from ${request.name}`}
    >
      <button
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close request details"
      />
      <aside className="relative h-full w-full max-w-xl overflow-y-auto border-l border-border bg-surface p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Request details
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{request.name}</h2>
            <p className="mt-1 text-sm text-text-muted">
              Received {formatDate(request.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-text-subtle hover:bg-bg-muted hover:text-text"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(request.status)}`}
          >
            {statusLabels[request.status]}
          </span>
          <span className="rounded-full bg-bg-muted px-2.5 py-1 text-xs text-text-muted">
            {projectLabels[request.projectType]}
          </span>
        </div>
        <div className="mt-7 grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-subtle">
              Company
            </p>
            <p className="mt-1">{request.company || "Independent client"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-subtle">
              Email
            </p>
            <a
              href={`mailto:${request.email}`}
              className="mt-1 flex items-center gap-2 break-all text-primary hover:underline"
            >
              <Mail size={14} />
              {request.email}
            </a>
          </div>
        </div>
        <div className="mt-7">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Discussion
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-muted">
            {request.discussion || "No discussion provided."}
          </p>
        </div>
        <div className="mt-7">
          <label
            htmlFor="internal-note"
            className="text-xs font-semibold uppercase tracking-wider text-primary"
          >
            Internal note
          </label>
          <p className="mt-1 text-xs text-text-subtle">
            Only Arribion employees can see this.
          </p>
          <textarea
            id="internal-note"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            placeholder="Add context for the team..."
            className="mt-3 w-full resize-y rounded-md border border-border bg-bg-muted p-3 text-sm leading-6 text-text outline-none focus:border-primary"
          />
          <button
            onClick={() => onSaveNotes(notes.trim() || null)}
            disabled={isUpdating}
            className="mt-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted disabled:opacity-50"
          >
            Save note
          </button>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
          <div className="mr-auto flex flex-wrap gap-2">
            {request.status === "pending" && (
              <ActionButton
                label="Confirm"
                icon={<Check size={15} />}
                onClick={() => onStatusChange(request, "confirmed")}
                disabled={isUpdating}
              />
            )}
            {canComplete && (
              <ActionButton
                label="Mark completed"
                icon={<Check size={15} />}
                onClick={() => onStatusChange(request, "completed")}
                disabled={isUpdating}
              />
            )}
            {canNoShow && (
              <button
                onClick={() => onStatusChange(request, "no_show")}
                disabled={isUpdating}
                className="rounded-md border border-warning/40 px-3 py-2 text-xs font-semibold text-warning hover:bg-warning/10 disabled:opacity-50"
              >
                Mark no-show
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => onStatusChange(request, "cancelled")}
                disabled={isUpdating}
                className="rounded-md border border-danger/30 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-muted"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-32 animate-pulse rounded-lg bg-surface" />
      ))}
    </div>
  );
}

function State({
  icon,
  message,
  action,
  actionLabel,
}: {
  icon: ReactNode;
  message: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center">
      <div className="mx-auto w-fit text-text-subtle">{icon}</div>
      <p className="mt-4 text-sm text-text-muted">{message}</p>
      {action && (
        <button
          onClick={action}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

import { Check, Circle, ListFilter } from "lucide-react";
import { useMemo, useState } from "react";

type TaskStatus = "todo" | "in_progress" | "done";
type TaskPriority = "low" | "medium" | "high";
type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
};

const startingTasks: Task[] = [
  {
    id: "task-1",
    title: "Review the Northwind Labs proposal",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-09-08",
    assignee: "Maya Grant",
  },
  {
    id: "task-2",
    title: "Prepare follow-up notes for Basin & Co.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-09-09",
    assignee: "Elena Ruiz",
  },
  {
    id: "task-3",
    title: "Finalize the coaching session deck",
    status: "done",
    priority: "low",
    dueDate: "2026-09-06",
    assignee: "Noah Clarke",
  },
  {
    id: "task-4",
    title: "Confirm the internal handoff for Brookside Studio",
    status: "todo",
    priority: "high",
    dueDate: "2026-09-10",
    assignee: "Maya Grant",
  },
];

const statusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Completed",
};
const priorityClass: Record<TaskPriority, string> = {
  low: "bg-bg-muted text-text-muted",
  medium: "bg-warning/10 text-warning",
  high: "bg-danger/10 text-danger",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(startingTasks);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const visible = useMemo(
    () => tasks.filter((task) => filter === "all" || task.status === filter),
    [filter, tasks],
  );
  const completed = tasks.filter((task) => task.status === "done").length;
  const cycleStatus = (id: string) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "todo"
                  ? "in_progress"
                  : task.status === "in_progress"
                    ? "done"
                    : "todo",
            }
          : task,
      ),
    );

  return (
    <div className="mx-auto max-w-6xl animate-fade-in space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Employee workspace
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Tasks
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            The work that needs attention across the team.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface px-4 py-3 text-sm shadow-card">
          <span className="font-semibold">{completed}</span>
          <span className="ml-1 text-text-muted">
            of {tasks.length} complete
          </span>
        </div>
      </header>
      <div className="flex items-center gap-2 overflow-x-auto border-y border-border py-4">
        <ListFilter size={16} className="mr-1 shrink-0 text-text-subtle" />
        {(["all", "todo", "in_progress", "done"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-md border px-3 py-2 text-sm transition-colors ${filter === status ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-text-muted hover:bg-bg-muted hover:text-text"}`}
          >
            {status === "all" ? "All tasks" : statusLabel[status]}
          </button>
        ))}
      </div>
      <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <div className="hidden grid-cols-[1fr_8rem_8rem_9rem] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-subtle md:grid">
          <span>Task</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Assignee</span>
        </div>
        {visible.map((task) => (
          <article
            key={task.id}
            className="grid gap-3 border-b border-border px-5 py-4 last:border-0 md:grid-cols-[1fr_8rem_8rem_9rem] md:items-center md:gap-4"
          >
            <button
              onClick={() => cycleStatus(task.id)}
              className="flex min-w-0 items-start gap-3 text-left"
              aria-label={`Mark ${task.title} as ${task.status === "done" ? "to do" : "next status"}`}
            >
              <span
                className={`mt-0.5 shrink-0 ${task.status === "done" ? "text-success" : "text-text-subtle"}`}
              >
                {task.status === "done" ? (
                  <Check size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </span>
              <span
                className={
                  task.status === "done"
                    ? "text-sm text-text-muted line-through"
                    : "text-sm font-medium"
                }
              >
                {task.title}
                <span className="mt-1 block text-xs text-text-subtle md:hidden">
                  {task.assignee}
                </span>
              </span>
            </button>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs capitalize ${priorityClass[task.priority]}`}
            >
              {task.priority}
            </span>
            <span className="text-sm text-text-muted">
              Due{" "}
              {new Date(task.dueDate).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-sm text-text-muted">{task.assignee}</span>
          </article>
        ))}
      </section>
      {visible.length === 0 && (
        <p className="py-12 text-center text-sm text-text-muted">
          No tasks match this filter.
        </p>
      )}
    </div>
  );
}

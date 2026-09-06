import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
}

export function StatCard({ label, value, helper, accent = "from-sky-500 to-blue-500" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ocean-surface/80 p-5 shadow-lg shadow-black/10">
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent}`} />
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
      {helper ? <div className="mt-2 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  tone?: "default" | "success" | "warning" | "danger" | "neutral";
}

export function StatusBadge({ status, tone = "default" }: StatusBadgeProps) {
  const toneMap: Record<string, string> = {
    default: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    neutral: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${toneMap[tone]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

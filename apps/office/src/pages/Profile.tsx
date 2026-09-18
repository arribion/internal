import { LogOut, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Account
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Your authenticated employee account details.
        </p>
      </header>
      <section className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {user?.name || "Arribion employee"}
            </h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>
        <dl className="grid gap-5 py-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
              Name
            </dt>
            <dd className="mt-1 text-sm">{user?.name || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
              Email
            </dt>
            <dd className="mt-1 wrap-break-word text-sm">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
              Account ID
            </dt>
            <dd className="mt-1 break-all font-mono text-xs text-text-muted">
              {user?.id}
            </dd>
          </div>
        </dl>
        <button
          onClick={() => void logout()}
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={16} /> Sign out
        </button>
      </section>
      <div className="flex items-center gap-2 text-xs text-text-subtle">
        <UserRound size={14} /> Profile details come from your active Arribion
        session.
      </div>
    </div>
  );
}

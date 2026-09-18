export type CallSessionStatus =
  | "available"
  | "occupied"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired";

export interface CallSession {
  id: string;
  scheduleSlotId: string;
  startsAt: string;
  endsAt: string;
  status: CallSessionStatus;
  createdAt: string;
  updatedAt: string;
}

export type CallRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "completed" | "cancelled" | "pending" | "confirmed" | "no_show";
  sessionId: string;
  projectType:
    | "new_website"
    | "redesign"
    | "web_app"
    | "performance_audit"
    | "other";
  name: string;
  email: string;
  company: string | null;
  discussion: string;
  internalNotes: string | null;
};

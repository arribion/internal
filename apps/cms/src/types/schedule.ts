export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ScheduleSlot {
  id: string;
  dayOfWeek: Weekday;
  startTime: string;
  endTime: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleSlotInput {
  dayOfWeek: Weekday;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface CallSession {
  id: string;
  scheduleSlotId: string;
  startsAt: string;
  endsAt: string;
  status:
    | "available"
    | "occupied"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "expired";
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

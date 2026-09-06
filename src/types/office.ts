export type AppRole = "admin" | "editor" | "sales" | "support" | "developer";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "reschedule_requested"
  | "follow_up";

export type SessionStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
}

export interface BookingRequest {
  id: string;
  clientName: string;
  company: string;
  email: string;
  requestedAt: string;
  status: BookingStatus;
  service: string;
  notes: string;
  budget?: string;
  sessionId?: string;
}

export interface CallSession {
  id: string;
  title: string;
  clientName: string;
  organizer: string;
  startAt: string;
  status: SessionStatus;
  room: string;
  bookingRequestId?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "active" | "prospect" | "paused";
  value: string;
  lastContact: string;
  projects: string[];
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: "planning" | "active" | "on_hold" | "completed";
  progress: number;
  dueDate: string;
  owner: string;
}

export interface WorkTask {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: AppRole;
  department: string;
  email: string;
  availability: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  kind: "request" | "session" | "task" | "client";
}

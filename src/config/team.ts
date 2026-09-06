// src/api/team.ts
import api from "./api"; // adjust path to your axios instance file

export interface TeamMember {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  position: string;
  role: "admin" | "member";
}

export interface RegisterMemberPayload extends TeamMember {
  password?: string;
}

// POST /api/v1/auth/team/register - Register a new team member
export const registerTeamMember = async (data: RegisterMemberPayload) => {
  const response = await api.post("/auth/team/register", data);
  return response.data;
};

// GET /api/v1/auth/team/me - Get current logged-in team member
export const getCurrentTeamMember = async (): Promise<TeamMember> => {
  const response = await api.get("/auth/team/me");
  return response.data;
};
import { useQuery } from "@tanstack/react-query";
import type { CallSession } from "@shared/types/call-session";
import api from "@/config/api";

type SessionResponse = { data?: CallSession[] | { data?: CallSession[] } };

function getSessions(response: SessionResponse): CallSession[] {
  return Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);
}

export function useCallSessions() {
  return useQuery({
    queryKey: ["call-sessions"],
    queryFn: async () => {
      const response = await api.get<SessionResponse>("/api/v1/call-sessions");
      return getSessions(response.data);
    },
  });
}

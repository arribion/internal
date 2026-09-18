import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";
import { CallSession } from "@/types/schedule";

function getList(response: {
  data?: CallSession[] | { data?: CallSession[] };
}): CallSession[] {
  return Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);
}

export function useCallSessions() {
  return useQuery({
    queryKey: ["call-sessions"],
    queryFn: async () => {
      const response = await api.get<{
        data?: CallSession[] | { data?: CallSession[] };
      }>("/api/v1/call-sessions");
      return getList(response.data);
    },
  });
}

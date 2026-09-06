import { useQuery } from "@tanstack/react-query";
import type { CallRequest } from "@shared/types/call-session";
import api from "@/config/api";

type RequestResponse = {
  data?: CallRequest[] | { data?: CallRequest[] };
};

function getRequests(response: RequestResponse): CallRequest[] {
  return Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);
}

export function useCallRequests() {
  return useQuery({
    queryKey: ["call-requests"],
    queryFn: async () => {
      const response = await api.get<RequestResponse>("/api/v1/call-requests");
      return getRequests(response.data);
    },
  });
}

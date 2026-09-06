import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";
import { CallRequest } from "@/types/schedule";

function getList(response: {
  data?: CallRequest[] | { data?: CallRequest[] };
}): CallRequest[] {
  return Array.isArray(response.data)
    ? response.data
    : (response.data?.data ?? []);
}

export function useCallRequests() {
  return useQuery({
    queryKey: ["call-requests"],
    queryFn: async () => {
      const response = await api.get<{
        data?: CallRequest[] | { data?: CallRequest[] };
      }>("/api/v1/call-requests");
      return getList(response.data);
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";
import { ScheduleSlot } from "@/types/schedule";

interface ListResponse<T> {
  data?: T[] | { data?: T[] };
}

function getList<T>(response: ListResponse<T>): T[] {
  if (Array.isArray(response.data)) return response.data;
  return response.data?.data ?? [];
}

export async function fetchSchedules(): Promise<ScheduleSlot[]> {
  const response = await api.get<ListResponse<ScheduleSlot>>(
    "/api/v1/schedule/active",
  );
  return getList(response.data);
}

export function useSchedules() {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });
}

export function useSchedule(id: string | null) {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: async () => {
      const response = await api.get<{ data?: ScheduleSlot }>(
        `/api/v1/schedule/${id}`,
      );
      return response.data.data ?? (response.data as unknown as ScheduleSlot);
    },
    enabled: Boolean(id),
  });
}

import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { PortfolioProject } from "@/types/portfolio-project";

async function fetchProject(id: string): Promise<PortfolioProject> {
  const { data } = await api.get<{ data: PortfolioProject }>(
    `/api/v1/projects/${id}`,
  );
  return data.data ?? null;
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
}

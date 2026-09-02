import { useQuery } from "@tanstack/react-query";
import { PortfolioProject } from "@/types/portfolio-project";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function fetchProject(id: string): Promise<PortfolioProject> {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }
  return response.json();
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
}

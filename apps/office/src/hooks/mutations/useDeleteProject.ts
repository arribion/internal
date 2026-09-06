import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteProject(projectId: string) {
const {data} = await api.delete(`/api/v1/projects/${projectId}`);
  return data;
}

export default function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      // Invalidate relevant queries, e.g., the list of projects
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

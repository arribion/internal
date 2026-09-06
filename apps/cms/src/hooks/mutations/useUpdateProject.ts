import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProjectArgs {
  id: string;
  formData: FormData;
}

async function updateProject({ id, formData }: UpdateProjectArgs) {
  const response = await api.patch(`/api/v1/projects/${id}`, formData);
  return response.data;
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific project
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
}

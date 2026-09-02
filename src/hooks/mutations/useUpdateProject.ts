import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface UpdateProjectArgs {
  id: string;
  formData: FormData;
}

async function updateProject({ id, formData }: UpdateProjectArgs) {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
    method: "PATCH",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update project: ${response.status} ${errorText}`,
    );
  }
  return response.json();
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

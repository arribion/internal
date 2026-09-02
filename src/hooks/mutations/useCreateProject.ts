import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function createProject(formData: FormData) {
  const response = await api.post(`${API_BASE_URL}/api/v1/projects`, formData);
  return response.data;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create project";
      toast.error(message);
    }
  });
}

import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function createProject(formData: FormData) {
  // Log what's actually in FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: `, value);
    // coverImage should be a File object, not {}
  }
  const response = await api.post("/api/v1/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // This might not work properly with boundary
    },
  });
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
    },
  });
}

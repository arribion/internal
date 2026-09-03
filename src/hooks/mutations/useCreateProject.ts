import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function createProject(formData: FormData) {
  // ✅ Let Axios set Content-Type automatically – DO NOT add headers.
  const response = await api.post("/api/v1/projects", formData);
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
      // Safely extract error message from the server
      const responseData = error?.response?.data;
      let errorMessage = "Failed to create project";

      if (responseData) {
        // If server returns an 'errors' object (field-specific)
        if (responseData.errors) {
          const messages = Object.values(responseData.errors).flat();
          if (messages.length) errorMessage = messages.join("; ");
        }
        // Fallback to a generic 'message' field
        else if (responseData.message) {
          errorMessage = responseData.message;
        }
        // If the server returns a string error
        else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      toast.error(errorMessage);
      // Also log the full error for debugging
      console.error("Create project error:", error);
      if (error?.response) {
        console.error("Server response:", error.response.data);
      }
    },
  });
}

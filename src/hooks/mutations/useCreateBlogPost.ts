import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createBlogPost(data: Record<string, any>) {
  const response = await api.post("/api/v1/blogs", data)
  return response.data
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

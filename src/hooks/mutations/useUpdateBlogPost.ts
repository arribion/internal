import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface UpdateBlogPostArgs {
  id: string;
  data: Record<string, any>;
}

async function updateBlogPost({ id, data }: UpdateBlogPostArgs) {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update blog post: ${response.status}`);
  }
  return response.json();
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog", variables.id] });
    },
  });
}

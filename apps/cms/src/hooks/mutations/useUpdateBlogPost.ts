import api from "@/config/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateBlogPostArgs {
  id: string;
  data: Record<string, any>;
}

async function updateBlogPost({ id, data }: UpdateBlogPostArgs) {
  const response = await api.put(`/api/v1/blogs/${id}`, data);
  return response.data;
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

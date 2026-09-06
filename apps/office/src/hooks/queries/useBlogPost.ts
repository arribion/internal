import api from "@/config/api";
import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";

async function fetchBlogPost(id: string): Promise<BlogPost> {
  const response = await api.get<BlogPost>(`/api/v1/blogs/${id}`);
  return response.data;
}

export function useBlogPost(id: string | null) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogPost(id!),
    enabled: !!id,
  });
}

import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function fetchBlogPost(id: string): Promise<BlogPost> {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog post: ${response.status}`);
  }
  return response.json();
}

export function useBlogPost(id: string | null) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogPost(id!),
    enabled: !!id,
  });
}

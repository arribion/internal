import api from "@/config/api";
import { BlogPost } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";


export default function useBlogPosts() {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      // Simulate an API call
      const { data } = await api.get<{ data: BlogPost[] }>(
        "/api/v1/blogs/cms/all",
      );
      return data.data;
    },
  });
}

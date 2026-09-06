export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[] | null;
  category: string | null;
  status: string | null;
  author: string | null;
  readTime: string | null;
  featured: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

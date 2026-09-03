export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  coverImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string[] | null;
  category: string | null;
  featured: boolean | null;
  status: ProjectStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type ProjectStatus = "draft" | "published" | "archived"
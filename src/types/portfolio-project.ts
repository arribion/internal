export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  tags: string[] | null;
  category: string | null;
  featured: boolean | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

import api from "@/config/api";
import { PortfolioProject } from "@/types/portfolio-project";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolioProjects"],
    queryFn: async () => {
      // Simulate an API call
      const { data } = await api.get<{ data: PortfolioProject[] }>(
        "/api/v1/projects/cms/all",
      );
      return data.data;
    },
  });
}

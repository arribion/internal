"use client";
import { useState } from "react";
import {
  Search, Plus,
  // FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
import ProjectList from "./ProjectList";
import usePortfolioProjects from "@/hooks/queries/usePortfolioProjects";

export default function ProjectPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: projects = [], refetch: refetchPortfolioProjects } = usePortfolioProjects();

  const navigate = useNavigate();
  // const queryClient = useQueryClient();

  const filtered = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const handleNavigate = (view: string) => {
    // Map DashboardView to actual routes if needed
    navigate(`/${view}`);
  };

  const handleRefresh = () => {
    refetchPortfolioProjects();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Projects</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {projects.length} total ·{" "}
            {projects.filter((p) => p.status === "published").length} published
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")}
          className="px-5 py-2.5 bg-linear-to-r from-sky-700 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-[#12121a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-lg text-sm capitalize transition-all ${
                statusFilter === s
                  ? "bg-sky-500/20 text-violet-300 border border-sky-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <ProjectList
        projects={filtered}
        onNavigate={handleNavigate}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

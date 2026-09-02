"use client";
import { useState } from "react";
import {
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  GitBranch,
  Star,
  Plus,
  FolderOpen,
  Globe,
} from "lucide-react";
import type { DashboardView } from "@/types";
import ProjectCard from "./ProjectCard";
import { PortfolioProject } from "@/types/portfolio-project";
import { Link } from "react-router-dom";
interface ProjectListProps {
  projects: PortfolioProject[];
  onNavigate: (view: DashboardView) => void;
  onRefresh: () => void;
}

export default function ProjectList({
  projects = [],
  onNavigate,
  onRefresh,
}: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Project Grid – unchanged except for delete call */}
      {filtered.length === 0 ? (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-16 text-center">
          <FolderOpen size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg text-gray-400 font-medium">
            No projects found
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {search
              ? "Try a different search term"
              : "Add your first portfolio project"}
          </p>
          {!search && (
            <Link to="/projects/new"
              className="mt-4 px-5 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition-colors">
              Add Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}

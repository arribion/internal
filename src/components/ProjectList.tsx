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
import type { Project, DashboardView } from "@/types";

interface ProjectListProps {
  projects: Project[];
  onNavigate: (view: DashboardView) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function ProjectList({ projects, onNavigate, onEdit, onDelete, onRefresh }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      onRefresh();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio Projects</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {projects.length} total · {projects.filter((p) => p.status === "published").length} published
          </p>
        </div>
        <button
          onClick={() => onNavigate("project-editor")}
          className="px-5 py-2.5 bg-linear-to-r from-sky-700 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
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
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-16 text-center">
          <FolderOpen size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg text-gray-400 font-medium">No projects found</h3>
          <p className="text-gray-600 text-sm mt-1">
            {search ? "Try a different search term" : "Add your first portfolio project"}
          </p>
          {!search && (
            <button
              onClick={() => onNavigate("project-editor")}
              className="mt-4 px-5 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition-colors"
            >
              Add Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-[#12121a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all group"
            >
              {/* Thumbnail */}
              {project.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                  <FolderOpen size={32} className="text-gray-700" />
                </div>
              )}

              <div className="p-4">
                {/* Title and actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {project.featured && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
                      <h3 className="text-white font-medium truncate">{project.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => onEdit(project.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                    >
                      <Edit3 size={14} />
                    </button>
                    {deleteConfirm === project.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded text-xs text-gray-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[10px] text-gray-600">+{project.tags.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Links and Status */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <GitBranch size={12} /> Code
                      </a>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      project.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

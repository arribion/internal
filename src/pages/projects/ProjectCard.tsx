import { PortfolioProject } from "@/types/portfolio-project";
import {
  FolderOpen,
  Star,
  Edit3,
  Trash2,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import React, { useState } from "react";
import  useDeleteProject from "@/hooks/mutations/useDeleteProject";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: PortfolioProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const deleteProjectMutation = useDeleteProject();
  const navigate=useNavigate();
  function handleEdit(id: string) { 
    navigate(`/projects/${id}/edit`);
  }

  const handleDelete = () => {
    deleteProjectMutation.mutate(project.id);
  };

  return (
    <div
      key={project.id}
      className="bg-[#12121a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all group">
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
              {project.featured && (
                <Star
                  size={14}
                  className="text-amber-400 fill-amber-400 shrink-0"
                />
              )}
              <h3 className="text-white font-medium truncate">
                {project.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => handleEdit(project.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
              <Edit3 size={14} />
            </button>
            {deleteConfirm === project.id ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  disabled={deleteProjectMutation.isPending}
                  className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 disabled:opacity-50">
                  {deleteProjectMutation.isPending ? "Deleting..." : "Yes"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-2 py-1 rounded text-xs text-gray-400">
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(project.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded-full">
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[10px] text-gray-600">
                +{project.tags.length - 4}
              </span>
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
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                <ExternalLink size={12} /> Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                <GitBranch size={12} /> Code
              </a>
            )}
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              project.status === "published"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}>
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
}

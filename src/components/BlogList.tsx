"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Star,
  Clock,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";
import type { BlogPost, DashboardView } from "@/types";

interface BlogListProps {
  blogs: BlogPost[];
  onNavigate: (view: DashboardView) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function BlogList({ blogs, onNavigate, onEdit, onDelete, onRefresh }: BlogListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      blog.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      onRefresh();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {blogs.length} total · {blogs.filter((b) => b.status === "published").length} published
          </p>
        </div>
        <button
          onClick={() => onNavigate("editor")}
          className="px-5 py-2.5 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={16} />
          New Post
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
            placeholder="Search blogs..."
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
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      {filtered.length === 0 ? (
        <div className="bg-[#12121a] border border-white/5 rounded-xl p-16 text-center">
          <FileText size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg text-gray-400 font-medium">No blog posts found</h3>
          <p className="text-gray-600 text-sm mt-1">
            {search ? "Try a different search term" : "Create your first blog post to get started"}
          </p>
          {!search && (
            <button
              onClick={() => onNavigate("editor")}
              className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-500 transition-colors"
            >
              Write a Blog
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((blog) => (
            <div
              key={blog.id}
              className="bg-[#12121a] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {blog.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.coverImage}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center shrink-0">
                    <FileText size={24} className="text-gray-600" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {blog.featured && <Star size={14} className="text-amber-400 fill-amber-400" />}
                        <h3 className="text-white font-medium truncate">{blog.title}</h3>
                      </div>
                      {blog.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => onEdit(blog.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      {deleteConfirm === blog.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(blog.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        blog.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {blog.status}
                    </span>
                    {blog.category && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Filter size={10} /> {blog.category}
                      </span>
                    )}
                    {blog.readTime && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} /> {blog.readTime}
                      </span>
                    )}
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar size={10} />{" "}
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                    </span>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex gap-1">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-violet-400/70">
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-gray-600">+{blog.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

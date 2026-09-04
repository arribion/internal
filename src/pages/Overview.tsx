"use client";
import {
  FileText,
  FolderOpen,
  Eye,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import usePortfolioProjects from "@/hooks/queries/usePortfolioProjects";
import useBlogPosts from "@/hooks/queries/useBlogPosts";

export default function Overview() {
  const navigate = useNavigate();
  const { data: blogs = [] } = useBlogPosts();
  const { data: projects = [] } = usePortfolioProjects();

  const publishedBlogs = blogs.filter((b) => b.status === "published");
  // const draftBlogs = blogs.filter(
  //   (b: (typeof blogs)[number]) => b.status === "draft",
  // );
  
  // const publishedProjects = projects.filter((p) => p.status === "published");
  const featuredBlogs = blogs.filter((b: (typeof blogs)[number]) => b.featured);

  const stats = [
    {
      label: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-500/10",
    },
    {
      label: "Published",
      value: publishedBlogs.length,
      icon: Eye,
      color: "from-emerald-500 to-green-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Projects",
      value: projects.length,
      icon: FolderOpen,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
    },
    {
      label: "Featured",
      value: featuredBlogs.length + projects.filter((p) => p.featured).length,
      icon: Star,
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back! Here&apos;s your content overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#12121a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/blogs/new"
          className="px-5 py-2.5 bg-linear-to-r from-sky-700 to-sky-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          + New Blog Post
        </Link>
        <Link
          to="/projects/new"
          className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
          + New Project
        </Link>
      </div>

      {/* Recent Blogs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Recent Blog Posts
          </h2>
          <Link
            to="/blogs"
            className="text-sm text-sky-500 hover:text-white transition-colors">
            View All →
          </Link>
        </div>
        {blogs.length === 0 ? (
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-10 text-center">
            <FileText size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">
              No blog posts yet. Create your first one!
            </p>
            <Link
              to="/blogs/new"
              className="mt-4 px-5 py-2 my-4 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition-colors">
              Write a Blog
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {blogs.slice(0, 5).map((blog: (typeof blogs)[number]) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                className="bg-[#12121a] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 min-w-0">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-violet-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate group-hover:text-violet-300 transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          blog.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                        {blog.status}
                      </span>
                      {blog.readTime && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {blog.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 shrink-0 ml-4">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <Link
            to="/projects"
            className="text-sm text-sky-500 hover:text-white transition-colors">
            View All →
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="bg-[#12121a] border border-white/5 rounded-xl p-10 text-center">
            <FolderOpen size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">
              No projects yet. Add your first portfolio project!
            </p>
            <Link
              to="/projects/new"
              className="mt-4 px-5 py-4 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition-colors">
              Add Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/edit`)}
                className="bg-[#12121a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all cursor-pointer group">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt=""
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                    <FolderOpen size={32} className="text-gray-700" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-white font-medium truncate group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Overview from "@/components/Overview";
// blogs
import BlogList from "@/components/BlogList";
import BlogEditor from "@/components/BlogEditor";
// projects
import ProjectList from "@/components/ProjectList";
import ProjectEditor from "@/components/ProjectEditor";



import type { BlogPost, Project, DashboardView } from "@/types";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<BlogPost[]>([]);
  const [contact, setContact] = useState<Project[]>([]);
  const [schedule, setSchedule] = useState<Project[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
   const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

   const fetchTeam = useCallback(async () => {
     try {
       const res = await fetch("/api/projects");
       const data = await res.json();
       setProjects(data);
     } catch (error) {
       console.error("Error fetching projects:", error);
     }
   }, []);

  const fetchContact = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);


  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    Promise.all([fetchBlogs(), fetchProjects()]).finally(() => setLoading(false));
  }, [fetchBlogs, fetchProjects]);

  const handleNavigate = (view: DashboardView) => {
    setCurrentView(view);
    setEditingBlogId(null);
    setEditingProjectId(null);
  };

  const handleEditBlog = (id: string) => {
    setEditingBlogId(id);
    setCurrentView("editor");
  };

  const handleEditProject = (id: string) => {
    setEditingProjectId(id);
    setCurrentView("project-editor");
  };

  const handleBlogSaved = () => {
    fetchBlogs();
    setEditingBlogId(null);
    setCurrentView("blogs");
  };

  const handleProjectSaved = () => {
    fetchProjects();
    setEditingProjectId(null);
    setCurrentView("projects");
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    switch (currentView) {
      case "overview":
        return (
          <Overview
            blogs={blogs}
            projects={projects}
            onNavigate={handleNavigate}
            onEditBlog={handleEditBlog}
            onEditProject={handleEditProject}
          />
        );
      case "blogs":
        return (
          <BlogList
            blogs={blogs}
            onNavigate={handleNavigate}
            onEdit={handleEditBlog}
            onDelete={() => fetchBlogs()}
            onRefresh={fetchBlogs}
          />
        );
      case "editor":
        return (
          <BlogEditor
            editingBlogId={editingBlogId}
            onSaved={handleBlogSaved}
            onCancel={() => handleNavigate("blogs")}
          />
        );
      case "projects":
        return (
          <ProjectList
            projects={projects}
            onNavigate={handleNavigate}
            onEdit={handleEditProject}
            onDelete={() => fetchProjects()}
            onRefresh={fetchProjects}
          />
        );
      case "project-editor":
        return (
          <ProjectEditor
            editingProjectId={editingProjectId}
            onSaved={handleProjectSaved}
            onCancel={() => handleNavigate("projects")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080d]">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080d]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-sm text-gray-400">
              <span className="text-gray-600">Arribion</span>
              <span className="mx-2 text-gray-700">/</span>
              <span className="text-white capitalize">
                {currentView === "editor"
                  ? editingBlogId
                    ? "Edit Blog"
                    : "New Blog"
                  : currentView === "project-editor"
                  ? editingProjectId
                    ? "Edit Project"
                    : "New Project"
                  : currentView}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.arribion.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              View Site ↗
            </a>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-500 to-sky-600 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-7xl">{renderContent()}</div>
      </main>
    </div>
  );
}

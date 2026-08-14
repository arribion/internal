"use client";
import { useState, useEffect } from "react";
import {
  Save,
  ExternalLink,
  GitBranch,
  Image,
  Tag,
  X,
  Upload,
  Globe,
  FolderOpen,
} from "lucide-react";
import type { Project } from "@/types";

interface ProjectEditorProps {
  editingProjectId: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProjectEditor({ editingProjectId, onSaved, onCancel }: ProjectEditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGitBranchUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingProjectId) {
      fetch(`/api/projects/${editingProjectId}`)
        .then((res) => res.json())
        .then((project: Project) => {
          setTitle(project.title);
          setDescription(project.description);
          setThumbnail(project.thumbnail || "");
          setLiveUrl(project.liveUrl || "");
          setGitBranchUrl(project.githubUrl || "");
          setCategory(project.category || "");
          setTags(project.tags || []);
          setStatus(project.status || "draft");
          setFeatured(project.featured || false);
        });
    }
  }, [editingProjectId]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async (publishStatus: string) => {
    setSaving(true);
    try {
      const body = {
        title,
        description,
        thumbnail: thumbnail || null,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        tags,
        category: category || null,
        status: publishStatus,
        featured,
      };

      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSaved();
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {editingProjectId ? "Edit Project" : "New Portfolio Project"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Add a project to your portfolio</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-4 py-2 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={16} />
            Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full bg-[#12121a] border border-white/10 rounded-xl px-5 py-3.5 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this project does, the technologies used, and what makes it special..."
              rows={6}
              className="w-full bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          {/* Links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block items-center gap-1.5">
                <Globe size={12} /> Live URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block items-center gap-1.5">
                <GitBranch size={12} /> GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGitBranchUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Technologies / Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="e.g. React, Next.js, TypeScript..."
                className="flex-1 bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Tag size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-300 rounded-full text-xs border border-violet-500/20"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Thumbnail */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Project Thumbnail</label>
            {
              // eslint-disable-next-line @next/next/no-img-element 
              thumbnail ? (
              <div className="relative group mb-3">
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => setThumbnail("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center mb-3">
                <Image size={24} className="text-gray-600 mb-2" />
                <p className="text-xs text-gray-600">No thumbnail</p>
              </div>
            )}
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Image URL..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Category */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors appearance-none"
            >
              <option value="">Select category</option>
              <option value="web">Web Application</option>
              <option value="mobile">Mobile App</option>
              <option value="design">Design</option>
              <option value="api">API / Backend</option>
              <option value="open-source">Open Source</option>
              <option value="ai">AI / ML</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
            <div className="flex gap-2">
              {["draft", "published"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                    status === s
                      ? s === "published"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Featured Project</span>
              <div
                onClick={() => setFeatured(!featured)}
                className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${
                  featured ? "bg-violet-600" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                    featured ? "left-5.5" : "left-0.5"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Preview Card */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Preview</label>
            <div className="bg-[#0a0a0f] rounded-lg overflow-hidden border border-white/5">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt="" className="w-full h-28 object-cover" />
              ) : (
                <div className="w-full h-28 bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center">
                  <FolderOpen size={24} className="text-gray-700" />
                </div>
              )}
              <div className="p-3">
                <h4 className="text-sm text-white font-medium truncate">{title || "Project Name"}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description || "Project description..."}</p>
                <div className="flex gap-2 mt-2">
                  {liveUrl && (
                    <span className="text-xs text-violet-400 flex items-center gap-1">
                      <ExternalLink size={10} /> Live
                    </span>
                  )}
                  {githubUrl && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <GitBranch size={10} /> Code
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

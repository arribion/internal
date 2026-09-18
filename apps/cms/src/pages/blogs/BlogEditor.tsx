"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Eye,
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  ChevronDown,
  Tag,
  X,
  Upload,
  User,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogPost } from "@/hooks/queries/useBlogPost";

import toast from "react-hot-toast";
import { useCreateBlogPost } from "@/hooks/mutations/useCreateBlogPost";
import { useUpdateBlogPost } from "@/hooks/mutations/useUpdateBlogPost";

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editingBlogId = id && id !== "new" ? id : null;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [_status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandPreview, setExpandPreview] = useState(false); // Expanded Preview Modal state
  const [saving, setSaving] = useState(false);
  const [codeLang, setCodeLang] = useState("javascript");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Hidden file input refs for local image selection
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const inlineFileInputRef = useRef<HTMLInputElement | null>(null);

  const languages = [
    "javascript",
    "typescript",
    "python",
    "jsx",
    "tsx",
    "html",
    "css",
    "bash",
    "json",
    "sql",
    "go",
    "rust",
    "java",
    "c",
    "cpp",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "yaml",
    "markdown",
  ];

  // Queries and Mutations
  const { data: blogData, isLoading: isLoadingBlog } =
    useBlogPost(editingBlogId);
  const createBlogMutation = useCreateBlogPost();
  const updateBlogMutation = useUpdateBlogPost();

  // Populate form when editing and data arrives
  useEffect(() => {
    if (editingBlogId && blogData) {
      setTitle(blogData.title);
      setAuthor(blogData.author || "");
      setExcerpt(blogData.excerpt || "");
      setContent(blogData.content);
      setCoverImage(blogData.coverImage || "");
      setCategory(blogData.category || "");
      setTags(blogData.tags || []);
      setStatus(blogData.status || "draft");
      setFeatured(blogData.featured || false);
    }
  }, [editingBlogId, blogData]);

  // Handle local preview selection for Cover Image without server upload
  const handleLocalCoverPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localObjectUrl = URL.createObjectURL(file);
    setCoverImage(localObjectUrl);
    toast.success("Cover image added to preview");

    if (coverFileInputRef.current) coverFileInputRef.current.value = "";
  };

  // Handle local preview insertion for Inline Body Image without server upload
  const handleLocalInlineImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localObjectUrl = URL.createObjectURL(file);
    const markdownImg = `\n![${file.name.split(".")[0]}](${localObjectUrl})\n`;

    const textarea = document.getElementById(
      "blog-content",
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) + markdownImg + content.substring(end);
      setContent(newContent);
    } else {
      setContent((prev) => prev + markdownImg);
    }

    toast.success("Inline image added to markdown preview");
    if (inlineFileInputRef.current) inlineFileInputRef.current.value = "";
  };

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = "", placeholder: string = "") => {
      const textarea = document.getElementById(
        "blog-content",
      ) as HTMLTextAreaElement;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end) || placeholder;
      const newContent =
        content.substring(0, start) +
        prefix +
        selected +
        suffix +
        content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selected.length,
        );
      }, 0);
    },
    [content],
  );

  const insertCodeBlock = useCallback(() => {
    const textarea = document.getElementById(
      "blog-content",
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const selected =
      content.substring(textarea.selectionStart, textarea.selectionEnd) ||
      "// your code here";
    const block = `\n\`\`\`${codeLang}\n${selected}\n\`\`\`\n`;
    const newContent =
      content.substring(0, start) +
      block +
      content.substring(textarea.selectionEnd);
    setContent(newContent);
  }, [content, codeLang]);

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
    if (!title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      publishStatus === "published" ? "Publishing blog..." : "Saving draft...",
    );

    try {
      const body = {
        title,
        author: author || null,
        excerpt,
        content,
        coverImage: coverImage || null,
        tags,
        category: category || null,
        status: publishStatus,
        featured,
      };

      if (editingBlogId) {
        await updateBlogMutation.mutateAsync({ id: editingBlogId, data: body });
      } else {
        await createBlogMutation.mutateAsync(body);
      }

      toast.success(
        publishStatus === "published"
          ? "Blog published successfully!"
          : "Draft saved successfully!",
        { id: toastId },
      );
      navigate("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save – please try again", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/blogs");
  };

  // Markdown preview rendering functions
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(
      /(!?\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g,
    );
    return parts.map((part, i) => {
      const imageMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        return (
          <img
            key={i}
            src={imageMatch[2]}
            alt={imageMatch[1] || "Blog Image"}
            className="my-4 rounded-lg max-h-96 w-full object-cover border border-white/10"
          />
        );
      }

      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 underline hover:text-sky-300">
            {linkMatch[1]}
          </a>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic text-gray-200">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="bg-white/10 text-sky-300 px-1.5 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderPreview = (text: string) => {
    const parts: React.ReactNode[] = [];
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "javascript";
    let blockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("```") && !inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "javascript";
        codeContent = "";
        continue;
      }
      if (line.startsWith("```") && inCodeBlock) {
        inCodeBlock = false;
        parts.push(
          <div
            key={`code-${blockIndex++}`}
            className="my-4 rounded-lg overflow-hidden">
            <div className="bg-[#1a1a2e] px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase">
                {codeLanguage}
              </span>
            </div>
            <SyntaxHighlighter
              language={codeLanguage}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "0.875rem",
              }}>
              {codeContent.trim()}
            </SyntaxHighlighter>
          </div>,
        );
        continue;
      }
      if (inCodeBlock) {
        codeContent += (codeContent ? "\n" : "") + line;
        continue;
      }

      if (line.startsWith("# ")) {
        parts.push(
          <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-3">
            {line.slice(2)}
          </h1>,
        );
      } else if (line.startsWith("## ")) {
        parts.push(
          <h2 key={i} className="text-2xl font-semibold text-white mt-5 mb-2">
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        parts.push(
          <h3 key={i} className="text-xl font-medium text-white mt-4 mb-2">
            {line.slice(4)}
          </h3>,
        );
      } else if (line.startsWith("> ")) {
        parts.push(
          <blockquote
            key={i}
            className="border-l-4 border-sky-500 pl-4 py-2 my-3 text-gray-300 italic bg-sky-500/5 rounded-r-lg">
            {line.slice(2)}
          </blockquote>,
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        parts.push(
          <li key={i} className="text-gray-300 ml-6 list-disc">
            {renderInlineMarkdown(line.slice(2))}
          </li>,
        );
      } else if (/^\d+\.\s/.test(line)) {
        parts.push(
          <li key={i} className="text-gray-300 ml-6 list-decimal">
            {renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}
          </li>,
        );
      } else if (line.trim() === "---") {
        parts.push(<hr key={i} className="border-white/10 my-6" />);
      } else if (line.trim() === "") {
        parts.push(<div key={i} className="h-3" />);
      } else {
        parts.push(
          <p key={i} className="text-gray-300 leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>,
        );
      }
    }
    return parts;
  };

  // Reusable Preview Body Component
  const BlogPreviewContent = () => (
    <div className="max-w-4xl mx-auto">
      {coverImage && (
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl mb-6 border border-white/10"
        />
      )}
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
        {title || "Untitled Post"}
      </h1>
      {author && (
        <p className="text-sky-400 font-medium text-base mb-4">By {author}</p>
      )}
      {excerpt && (
        <p className="text-lg text-gray-300 mb-6 italic leading-relaxed">
          {excerpt}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-white/10">
        {category && (
          <span className="text-xs px-3 py-1 bg-violet-500/10 text-violet-300 font-medium rounded-full border border-violet-500/20">
            {category}
          </span>
        )}
        {tags.map((tag) => (
          <span key={tag} className="text-xs text-gray-400">
            #{tag}
          </span>
        ))}
      </div>
      <div className="prose prose-invert max-w-none text-base md:text-lg">
        {renderPreview(content)}
      </div>
    </div>
  );

  if (isLoadingBlog && editingBlogId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleLocalCoverPreview}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={inlineFileInputRef}
        onChange={handleLocalInlineImagePreview}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {editingBlogId ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Write, preview, and publish your content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPreview(!showPreview);
              if (showPreview) setExpandPreview(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              showPreview
                ? "bg-sky-500/20 text-violet-300 border border-sky-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}>
            <Eye size={16} />
            {showPreview ? "Hide Preview" : "Side Preview"}
          </button>
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50">
            <Save size={16} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-4 py-2 bg-linear-to-r from-sky-500 to-sky-700 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
            <Upload size={16} />
            Publish
          </button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          showPreview && !expandPreview ? "lg:grid-cols-2" : "grid-cols-1"
        }`}>
        {/* Editor Panel */}
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog post title..."
            className="w-full bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 text-xl text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
          />

          {/* Author Field */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
              Author
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full bg-[#12121a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief excerpt or description..."
            rows={2}
            className="w-full bg-[#12121a] border border-white/10 rounded-xl px-5 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
          />

          {/* Cover Image Controls */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
              Cover Image URL or Pick Local File
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg or blob:..."
                className="flex-1 bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <ImageIcon size={16} />
                <span className="hidden sm:inline">Select Image</span>
              </button>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Technology"
                className="w-full bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add tag..."
                  className="flex-1 bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <Tag size={16} />
                </button>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-300 rounded-full text-xs border border-violet-500/20">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFeatured(!featured)}
              className={`w-10 h-5 rounded-full transition-all ${featured ? "bg-sky-500" : "bg-white/10"} relative`}>
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                  featured ? "left-5" : "left-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-400">Featured post</span>
          </label>

          {/* Toolbar */}
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-2 flex flex-wrap items-center gap-1">
            <ToolbarBtn
              icon={Bold}
              onClick={() => insertMarkdown("**", "**", "bold text")}
              title="Bold"
            />
            <ToolbarBtn
              icon={Italic}
              onClick={() => insertMarkdown("*", "*", "italic text")}
              title="Italic"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarBtn
              icon={Heading1}
              onClick={() => insertMarkdown("# ", "", "Heading")}
              title="Heading 1"
            />
            <ToolbarBtn
              icon={Heading2}
              onClick={() => insertMarkdown("## ", "", "Heading")}
              title="Heading 2"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarBtn
              icon={List}
              onClick={() => insertMarkdown("- ", "", "list item")}
              title="Bullet List"
            />
            <ToolbarBtn
              icon={ListOrdered}
              onClick={() => insertMarkdown("1. ", "", "list item")}
              title="Numbered List"
            />
            <ToolbarBtn
              icon={Quote}
              onClick={() => insertMarkdown("> ", "", "quote")}
              title="Quote"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ToolbarBtn
              icon={LinkIcon}
              onClick={() => insertMarkdown("[", "](url)", "link text")}
              title="Link"
            />
            <ToolbarBtn
              icon={ImageIcon}
              onClick={() => inlineFileInputRef.current?.click()}
              title="Add Local Image to Preview"
            />
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Code block with language selector */}
            <div className="relative">
              <button
                type="button"
                onClick={insertCodeBlock}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs"
                title="Code Block">
                <Code size={16} />
                <span className="hidden sm:inline">{codeLang}</span>
                <ChevronDown
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLangDropdown(!showLangDropdown);
                  }}
                />
              </button>
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto w-40">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setCodeLang(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors ${
                        lang === codeLang ? "text-violet-400" : "text-gray-400"
                      }`}>
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <textarea
            id="blog-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here in Markdown..."
            className="w-full bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none font-mono leading-relaxed"
            rows={20}
          />
        </div>

        {/* Side Preview Panel */}
        {showPreview && !expandPreview && (
          <div className="bg-[#12121a] border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[80vh] relative">
            {/* Header Control with Expand Button */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Side Preview
              </span>
              <button
                type="button"
                onClick={() => setExpandPreview(true)}
                className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-all"
                title="Expand to Full Desktop View">
                <Maximize2 size={14} />
                <span>Full Desktop Screen</span>
              </button>
            </div>
            <BlogPreviewContent />
          </div>
        )}
      </div>

      {/* Full Desktop Screen Modal Preview */}
      {showPreview && expandPreview && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm uppercase tracking-wider text-sky-400 font-semibold">
                Desktop View Preview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExpandPreview(false)}
                className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all">
                <Minimize2 size={14} />
                <span>Minimize to Side View</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandPreview(false);
                  setShowPreview(false);
                }}
                className="p-2 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                title="Close Preview">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            <BlogPreviewContent />
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({
  icon: Icon,
  onClick,
  title,
}: {
  icon: React.ElementType;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
      <Icon size={16} />
    </button>
  );
}

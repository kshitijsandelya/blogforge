import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}

export default function CreatePost() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiContentLoading, setAiContentLoading] = useState(false);
  const [aiTagsLoading, setAiTagsLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerateContent = async () => {
    if (!form.title.trim()) {
      toast.error("Enter a title first");
      return;
    }
    setAiContentLoading(true);
    try {
      const { data } = await api.post("/posts/ai/generate-content", {
        title: form.title,
        description: form.description,
      });
      setForm((f) => ({ ...f, content: data.content }));
      toast.success("Content generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiContentLoading(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!form.title.trim()) {
      toast.error("Enter a title first");
      return;
    }
    setAiTagsLoading(true);
    try {
      const { data } = await api.post("/posts/ai/generate-tags", {
        title: form.title,
        content: form.content,
      });
      setForm((f) => ({ ...f, tags: data.tags.join(", ") }));
      toast.success("Tags generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Tag generation failed");
    } finally {
      setAiTagsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("tags", form.tags);
      if (image) formData.append("coverImage", image);
      const { data } = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post published!");
      navigate(`/post/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const tagList = form.tags
    ? form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={150}
            placeholder="Enter your post title..."
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition-colors"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded object-cover"
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload a cover image (JPEG, PNG, WebP — max 5MB)
              </p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          {preview && (
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview("");
              }}
              className="text-xs text-red-500 mt-1 hover:underline"
            >
              Remove image
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            AI Description{" "}
            <span className="text-gray-400 font-normal">
              (for AI content generation)
            </span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Briefly describe what this post is about — used for AI generation"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleGenerateContent}
            disabled={aiContentLoading}
            className="flex items-center gap-2 border border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded px-4 py-2 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
          >
            {aiContentLoading ? <Spinner /> : "✨"} Generate Content
          </button>
          <button
            type="button"
            onClick={handleGenerateTags}
            disabled={aiTagsLoading}
            className="flex items-center gap-2 border border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded px-4 py-2 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
          >
            {aiTagsLoading ? <Spinner /> : "🏷️"} Generate Tags
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content{" "}
            <span className="text-gray-400 font-normal">
              (supports Markdown)
            </span>
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            placeholder="Write your post content here... Markdown is supported."
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm font-mono min-h-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags{" "}
            <span className="text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. technology, programming, tutorial"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded px-4 py-3 font-medium transition-colors"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}

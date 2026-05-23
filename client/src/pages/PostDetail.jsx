import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  HeartIcon as HeartOutline,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CommentSection from "../components/CommentSection.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
    } catch {
      toast.error("Post not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Log in to like posts");
      return;
    }
    setLikeLoading(true);
    try {
      const { data } = await api.put(`/posts/${id}/like`);
      setPost((p) => ({ ...p, likes: data.likes }));
    } catch {
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading...
      </div>
    );
  if (!post) return null;

  const isAuthor = user && post.author._id === user._id;
  const isLiked = user && post.likes.includes(user._id);
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {post.author.username}
        </span>
        <span>{date}</span>
        <span className="flex items-center gap-1">
          <EyeIcon className="w-4 h-4" /> {post.views} views
        </span>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 hover:text-red-500"
        >
          {isLiked ? (
            <HeartSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
          <span>
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </span>
        </button>

        {isAuthor && (
          <div className="flex items-center gap-2 ml-auto">
            <Link
              to={`/edit/${post._id}`}
              className="flex items-center gap-1 text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <PencilSquareIcon className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-sm border border-red-300 text-red-600 rounded px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="prose-content text-gray-800 dark:text-gray-200 leading-relaxed">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <CommentSection
        postId={post._id}
        comments={post.comments || []}
        postAuthorId={post.author._id}
        onCommentChange={fetchPost}
      />
    </div>
  );
}

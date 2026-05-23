import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

export default function CommentSection({
  postId,
  comments,
  postAuthorId,
  onCommentChange,
}) {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post(`/comments/${postId}`, { content });
      setContent("");
      toast.success("Comment added");
      onCommentChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      onCommentChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        Comments ({comments.length})
      </h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={500}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-gray-100"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">{content.length}/500</span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded px-4 py-2 text-sm font-medium transition-colors"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="border border-gray-200 dark:border-gray-700 rounded p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {comment.author?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {comment.author?.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {user &&
                (comment.author?._id === user._id ||
                  postAuthorId === user._id) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete comment"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

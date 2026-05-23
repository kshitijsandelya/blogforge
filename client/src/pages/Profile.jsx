import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import BlogCard from "../components/BlogCard.jsx";

export default function Profile() {
  const { user, login, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts", {
          params: { author: user?._id, limit: 50 },
        });
        setPosts(data.posts);
        const myPosts = data.posts.filter((p) => p.author._id === user?._id);
        setPosts(myPosts);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    setBio(user?.bio || "");
  }, [user]);

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const { data } = await api.put("/auth/profile", { bio });
      login(data, token);
      toast.success("Bio updated");
      setEditingBio(false);
    } catch {
      toast.error("Failed to update bio");
    } finally {
      setSavingBio(false);
    }
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {user?.email}
          </p>

          {editingBio ? (
            <div className="flex flex-col gap-2 max-w-md">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="Tell something about yourself..."
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  disabled={savingBio}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />{" "}
                  {savingBio ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingBio(false);
                    setBio(user?.bio || "");
                  }}
                  className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
                {user?.bio || (
                  <span className="text-gray-400 italic">No bio yet.</span>
                )}
              </p>
              <button
                onClick={() => setEditingBio(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors mt-0.5"
                title="Edit bio"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-8 mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{posts.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{totalLikes}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Likes Received
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Your Posts</h2>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

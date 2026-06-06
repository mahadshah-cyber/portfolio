"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  async function togglePublished(post: Post) {
    try {
      await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      fetchPosts();
    } catch (err) {
      console.error("Failed to toggle post:", err);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/posts/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your blog content</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-900/50 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-zinc-600 text-lg">No posts yet</p>
            <p className="text-zinc-700 text-sm mt-2">
              <Link href="/admin/blog/new" className="text-red-500 hover:underline">
                Create your first post
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{post.title}</h3>
                  <p className="text-zinc-600 text-xs mt-0.5 font-mono">
                    /blog/{post.slug} &middot; {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(post)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.published
                        ? "text-green-500 hover:bg-green-950/30"
                        : "text-zinc-600 hover:bg-zinc-800"
                    }`}
                    title={post.published ? "Published" : "Draft"}
                  >
                    {post.published ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(post.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="glass-card rounded-2xl p-6 max-w-sm w-full text-center">
              <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Delete Post</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

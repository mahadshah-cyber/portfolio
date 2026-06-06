"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { RichEditor } from "@/components/blog/RichEditor";
import { slugify } from "@/lib/utils";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/posts`);
        const data = await res.json();
        const posts = data.posts || [];
        const post = posts.find((p: { id: string }) => p.id === params.id);
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setContent(post.content);
          setExcerpt(post.excerpt || "");
          setPublished(post.published);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchPost();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, excerpt, published }),
      });
      if (res.ok) {
        router.push("/admin/blog");
      }
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-black flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog"
              className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Post</h1>
              <p className="text-zinc-500 text-sm mt-0.5">Update your blog article</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 lg:p-8 space-y-6">
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm focus:border-red-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm font-mono focus:border-red-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">
              Excerpt
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-sm focus:border-red-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">
              Content (HTML)
            </label>
            <RichEditor value={content} onChange={setContent} />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-zinc-300">Published</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-medium transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

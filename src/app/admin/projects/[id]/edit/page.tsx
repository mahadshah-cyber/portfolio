"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const categories = ["Web", "Security", "Mobile"];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [category, setCategory] = useState("Web");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        const projects = data.projects || [];
        const project = projects.find((p: { id: string }) => p.id === params.id);
        if (project) {
          setTitle(project.title);
          setDescription(project.description);
          setTech(project.tech);
          setCategory(project.category);
          setGithubUrl(project.githubUrl || "");
          setLiveUrl(project.liveUrl || "");
          setImageUrl(project.imageUrl || "");
          setFeatured(project.featured);
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchProject();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description,
          tech: tech.split(",").map((t: string) => t.trim()),
          category, githubUrl, liveUrl, imageUrl, featured,
        }),
      });
      if (res.ok) router.push("/admin/projects");
    } catch (err) {
      console.error("Failed to update project:", err);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/projects" className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Project</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Update project details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 lg:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none resize-none" />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Tech Stack (comma separated)</label>
            <input type="text" value={tech} onChange={(e) => setTech(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">GitHub URL</label>
              <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Live URL</label>
              <input type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2 font-accent">Image URL</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm focus:border-red-500/50 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-red-500" />
              <span className="text-sm text-zinc-300">Featured</span>
            </label>
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-medium transition-all">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

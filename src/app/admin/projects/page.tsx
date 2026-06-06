"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  async function toggleFeatured(project: Project) {
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      fetchProjects();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/projects/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your portfolio projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-900/50 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-zinc-600 text-lg">No projects yet</p>
            <p className="text-zinc-700 text-sm mt-2">
              <Link href="/admin/projects/new" className="text-red-500 hover:underline">
                Add your first project
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium">{project.title}</h3>
                    {project.featured && (
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className="text-zinc-600 text-xs mt-0.5 font-mono">
                    {project.category} &middot; {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(project)}
                    className={`p-2 rounded-lg transition-colors ${
                      project.featured
                        ? "text-yellow-500 hover:bg-yellow-950/30"
                        : "text-zinc-600 hover:bg-zinc-800"
                    }`}
                    title={project.featured ? "Featured" : "Not featured"}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(project.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
            <div className="glass-card rounded-2xl p-6 max-w-sm w-full text-center">
              <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Delete Project</h3>
              <p className="text-zinc-400 text-sm mb-6">Are you sure? This cannot be undone.</p>
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

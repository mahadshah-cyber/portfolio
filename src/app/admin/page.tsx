"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, FolderOpen, Plus, LogOut, PenLine } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, totalProjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          fetch("/api/admin/posts"),
          fetch("/api/admin/projects"),
        ]);
        const postsData = await postsRes.json();
        const projectsData = await projectsRes.json();
        const posts = postsData.posts || [];
        const projects = projectsData.projects || [];
        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: { published: boolean }) => p.published).length,
          totalProjects: projects.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const cards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      href: "/admin/blog",
      color: "text-blue-400",
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: PenLine,
      href: "/admin/blog",
      color: "text-green-400",
    },
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your portfolio content</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900/30 transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-10">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="glass-card rounded-xl p-6 hover:border-red-900/30 transition-all duration-300 group"
            >
              <card.icon className={`w-8 h-8 ${card.color} mb-3 group-hover:scale-110 transition-transform`} />
              <div className="text-2xl lg:text-3xl font-bold text-white">
                {loading ? (
                  <span className="inline-block w-8 h-6 rounded bg-zinc-800 animate-pulse" />
                ) : (
                  card.value
                )}
              </div>
              <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest font-accent">
                {card.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/admin/blog/new"
            className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-red-900/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-red-950/30 flex items-center justify-center group-hover:bg-red-950/50 transition-colors">
              <Plus className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-white font-medium">New Blog Post</p>
              <p className="text-zinc-500 text-xs mt-0.5">Write and publish a new article</p>
            </div>
          </Link>
          <Link
            href="/admin/projects"
            className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-red-900/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-red-950/30 flex items-center justify-center group-hover:bg-red-950/50 transition-colors">
              <FolderOpen className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-white font-medium">Manage Projects</p>
              <p className="text-zinc-500 text-xs mt-0.5">Add or edit portfolio projects</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

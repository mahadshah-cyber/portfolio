"use client";

import { useEffect, useState } from "react";
import { GitBranch, Activity, Zap } from "lucide-react";

interface ActivityData {
  lastCommit: { repo: string; message: string; url: string; time: string };
  status: string;
  online: boolean;
  username: string;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function ActivityFeed() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) setData(await res.json());
      } catch { /* silent */ }
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Tick time display every 30s
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // Suppress tick warning
  void tick;

  if (!data) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-zinc-700" />
        <span className="text-[10px] text-zinc-700 font-mono">Loading activity...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Status row */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 backdrop-blur-sm">
        <span className="relative w-2 h-2 shrink-0">
          {data.online && (
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-60" />
          )}
          <span className={`absolute inset-0 rounded-full ${data.online ? "bg-green-400" : "bg-zinc-600"}`} />
        </span>
        <Zap className="w-3 h-3 text-red-500/70 shrink-0" />
        <span className="text-[10px] font-mono text-zinc-400">
          Currently: <span className="text-red-400">{data.status}</span>
        </span>
      </div>

      {/* Last commit row */}
      <a
        href={data.lastCommit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-2 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 backdrop-blur-sm hover:border-red-900/40 hover:bg-zinc-900/80 transition-all duration-200"
      >
        <GitBranch className="w-3 h-3 text-red-500/70 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-600 font-mono">{data.username}/</span>
            <span className="text-[10px] text-zinc-400 font-mono group-hover:text-red-400 transition-colors truncate">
              {data.lastCommit.repo}
            </span>
          </div>
          <p className="text-[9px] text-zinc-500 font-mono truncate mt-0.5 leading-relaxed">
            {data.lastCommit.message}
          </p>
          <span className="text-[9px] text-zinc-700 font-mono">
            {timeAgo(data.lastCommit.time)}
          </span>
        </div>
        <Activity className="w-3 h-3 text-zinc-700 shrink-0 mt-0.5 group-hover:text-red-500/50 transition-colors" />
      </a>
    </div>
  );
}

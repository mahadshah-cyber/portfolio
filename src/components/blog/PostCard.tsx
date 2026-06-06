"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { soundManager } from "@/lib/sound";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    createdAt: Date;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-red-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/5"
      onMouseEnter={() => soundManager.hover()}
      onClick={() => soundManager.click()}
    >
      <div className="flex items-center gap-4 text-xs text-zinc-600 mb-4">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(post.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          5 min read
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors mb-2">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-zinc-500 text-sm leading-relaxed">
          {truncate(post.excerpt, 120)}
        </p>
      )}

      <div className="mt-4 flex items-center gap-1 text-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
        Read More <ArrowRight size={14} />
      </div>
    </Link>
  );
}

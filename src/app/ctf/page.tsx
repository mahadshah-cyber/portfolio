"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Skull, Zap, Trophy, ArrowLeft, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CtfChallenge {
  name: string;
  platform: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Solved" | "In Progress" | "Upcoming";
  writeup?: string;
  flag?: string;
}

const challenges: CtfChallenge[] = [
  { name: "Bandit (OverTheWire)", platform: "OverTheWire", category: "Linux", difficulty: "Easy", status: "Solved", writeup: "#", flag: "REDACTED" },
  { name: "Basic SQL Injection", platform: "TryHackMe", category: "Web", difficulty: "Easy", status: "Solved", writeup: "#", flag: "REDACTED" },
  { name: "Crypto 101", platform: "CTFlearn", category: "Cryptography", difficulty: "Medium", status: "Solved", writeup: "#" },
  { name: "Stego Basics", platform: "CTFlearn", category: "Steganography", difficulty: "Easy", status: "Solved" },
  { name: "Reverse Engineering 101", platform: "TryHackMe", category: "Reverse", difficulty: "Medium", status: "In Progress" },
  { name: "Web Exploitation", platform: "picoCTF", category: "Web", difficulty: "Medium", status: "In Progress" },
  { name: "Binary Exploitation", platform: "picoCTF", category: "Binary", difficulty: "Hard", status: "Upcoming" },
  { name: "Forensics Master", platform: "CTFlearn", category: "Forensics", difficulty: "Medium", status: "Upcoming" },
];

const stats = [
  { label: "Challenges Solved", value: "4", icon: Trophy },
  { label: "Platforms", value: "4", icon: Globe },
  { label: "Writeups", value: "3", icon: Terminal },
  { label: "Rank (Global)", value: "Top 30%", icon: Zap },
];

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-green-950/30 text-green-500 border-green-900/30",
    Medium: "bg-yellow-950/30 text-yellow-500 border-yellow-900/30",
    Hard: "bg-red-950/30 text-red-500 border-red-900/30",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] rounded-full border font-mono uppercase tracking-wider ${colors[difficulty] || ""}`}>
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Solved: "text-green-500",
    "In Progress": "text-yellow-500",
    Upcoming: "text-zinc-600",
  };
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wider ${colors[status] || ""}`}>
      {status === "Solved" ? "✓" : status === "In Progress" ? "◷" : "○"} {status}
    </span>
  );
}

export default function CtfPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? challenges : challenges.filter((c) => c.category === filter);
  const categories = ["All", ...new Set(challenges.map((c) => c.category))];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.children || [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      const statCards = statsRef.current?.querySelectorAll(".stat-card");
      if (statCards) {
        gsap.fromTo(
          statCards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.6, stagger: 0.1, ease: "back.out(1.7)",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          }
        );
      }

      const rows = gridRef.current?.querySelectorAll(".challenge-row");
      if (rows) {
        gsap.fromTo(
          rows,
          { x: -20, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.5, stagger: 0.04, ease: "power2.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen pt-24 pb-16 bg-black"
    >
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.05),transparent_60%)] pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-red-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-10">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Skull className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent">CTF Arena</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                Capture The <span className="text-gradient-cinematic">Flag</span>
              </h1>
            </div>
          </div>
          <p className="text-zinc-500 max-w-2xl text-sm">
            Documenting my CTF journey — challenges solved, techniques learned, and writeups
            from platforms like TryHackMe, picoCTF, OverTheWire, and CTFlearn.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="stat-card rounded-xl glass-card p-5 text-center hover:border-red-900/30 transition-all duration-300"
              >
                <Icon className="w-5 h-5 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-accent mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                filter === cat
                  ? "bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Challenges table */}
        <div ref={gridRef} className="rounded-2xl glass-card overflow-hidden">
          {/* Header row */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-800/50">
            <span className="col-span-4 text-[10px] text-zinc-600 uppercase tracking-widest font-accent">Challenge</span>
            <span className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest font-accent">Platform</span>
            <span className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest font-accent">Category</span>
            <span className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest font-accent">Difficulty</span>
            <span className="col-span-2 text-[10px] text-zinc-600 uppercase tracking-widest font-accent text-right">Status</span>
          </div>

          {filtered.map((challenge, i) => (
            <div
              key={`${challenge.name}-${i}`}
              className="challenge-row grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-6 py-5 border-b border-zinc-800/30 last:border-0 hover:bg-zinc-900/30 transition-colors group"
            >
              {/* Name + mobile meta */}
              <div className="lg:col-span-4">
                <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                  {challenge.name}
                </p>
                <div className="flex items-center gap-2 mt-1 lg:hidden">
                  <StatusBadge status={challenge.status} />
                  <DifficultyBadge difficulty={challenge.difficulty} />
                </div>
              </div>
              <div className="lg:col-span-2 text-sm text-zinc-500">{challenge.platform}</div>
              <div className="lg:col-span-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider">
                  {challenge.category}
                </span>
              </div>
              <div className="lg:col-span-2 hidden lg:block">
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>
              <div className="lg:col-span-2 flex items-center justify-end gap-3">
                <div className="hidden lg:block">
                  <StatusBadge status={challenge.status} />
                </div>
                {challenge.writeup && (
                  <a
                    href={challenge.writeup}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-zinc-800 transition-all"
                    title="View writeup"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 text-sm">No challenges in this category yet.</p>
            </div>
          )}
        </div>

        {/* Empty state if no challenges at all */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-xs tracking-wider font-accent">
            Updated regularly as new challenges are conquered.
          </p>
        </div>
      </div>
    </div>
  );
}

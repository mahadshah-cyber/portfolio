"use client";

import { useState } from "react";
import { soundManager } from "@/lib/sound";
import { Terminal, ShieldAlert, Award, Key, CheckCircle } from "lucide-react";

interface CTFWriteupProps {
  post: {
    title: string;
    content: string;
    createdAt: Date | string;
  };
}

export function CTFWriteup({ post }: CTFWriteupProps) {
  const [flagInput, setFlagInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Extract flag from post content if embedded like <!-- flag: CTF{xxx} -->
  const flagRegex = /<!--\s*flag:\s*(.*?)\s*-->/;
  const match = post.content.match(flagRegex);
  const embeddedFlag = match ? match[1].trim() : "CTF{mahad_sh4h_ctf_pr0}";

  // Extract difficulty, platform, and category if present in the post content
  // Syntax in content: <!-- platform: TryHackMe -->, <!-- category: Web -->, <!-- difficulty: Hard -->
  const getMeta = (key: string, fallback: string) => {
    const r = new RegExp(`<!--\\s*${key}:\\s*(.*?)\\s*-->`);
    const m = post.content.match(r);
    return m ? m[1].trim() : fallback;
  };

  const platform = getMeta("platform", "CTF Arena");
  const category = getMeta("category", "General");
  const difficulty = getMeta("difficulty", "Medium");

  // Clean the content of comments so they don't render in HTML
  const cleanedContent = post.content.replace(/<!--[\s\S]*?-->/g, "");

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput.trim() === embeddedFlag) {
      soundManager.success();
      setVerified(true);
      setErrorMsg("");
    } else {
      soundManager.error();
      setAttempts((a) => a + 1);
      setErrorMsg("INVALID FLAG HASH — DECIPHER FAILURE");
      setTimeout(() => setErrorMsg(""), 2000);
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-400 border-green-500/20 bg-green-950/20";
      case "hard":
      case "insane": return "text-red-400 border-red-500/20 bg-red-950/20";
      default: return "text-yellow-400 border-yellow-500/20 bg-yellow-950/20";
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* CTF Terminal Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/3 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-500 animate-pulse">
              <Terminal size={18} />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-accent">CTF Classification</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">[{platform}]</span>
                <span className="text-xs text-zinc-400">{category}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded text-[10px] border font-bold uppercase tracking-wider ${getDifficultyColor()}`}>
              {difficulty}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-950/20 border border-green-500/20 px-2 py-0.5 rounded font-bold uppercase">
              <Award size={12} />
              Solved
            </span>
          </div>
        </div>
      </div>

      {/* Flag Verifier Box */}
      <div className={`rounded-xl border p-5 transition-all duration-300 ${
        verified
          ? "border-green-500/40 bg-green-950/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          : errorMsg
          ? "border-red-500/40 bg-red-950/10 animate-shake"
          : "border-zinc-800 bg-zinc-900/30"
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Key className={`w-4 h-4 ${verified ? "text-green-400" : "text-red-500"}`} />
          <span className={`text-[10px] uppercase tracking-widest font-bold ${verified ? "text-green-400" : "text-zinc-400"}`}>
            {verified ? "FLAG VERIFIED — CHALLENGE COMPLETE" : "INTERACTIVE FLAG VALIDATOR"}
          </span>
        </div>

        {verified ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-950/30 border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <div className="text-xs text-green-300">
              <p className="font-bold">CONGRATULATIONS! FLAG MATCHED.</p>
              <p className="font-mono mt-0.5 select-all">{embeddedFlag}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyFlag} className="flex gap-2">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="CTF{flag_goes_here}"
              className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-700 font-mono outline-none focus:border-red-500/50 transition-colors"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600/10 border border-red-700/40 rounded-lg text-xs text-red-400 hover:bg-red-600/20 transition-all font-bold uppercase tracking-wider"
            >
              Verify
            </button>
          </form>
        )}
        
        {errorMsg && (
          <p className="text-[9px] text-red-400 font-bold mt-2 animate-pulse flex items-center gap-1">
            <ShieldAlert size={10} />
            {errorMsg}
          </p>
        )}
      </div>

      {/* Main Post Content */}
      <div
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-a:text-red-500 prose-strong:text-zinc-300 prose-code:text-red-400 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 font-sans"
        dangerouslySetInnerHTML={{ __html: cleanedContent }}
      />
    </div>
  );
}

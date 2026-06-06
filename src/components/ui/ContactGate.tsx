"use client";

import { useState, useEffect, useRef } from "react";
import { soundManager } from "@/lib/sound";
import { Lock, Unlock, Eye, EyeOff, Terminal } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   Contact Gate — CTF Puzzle
   Visitors must solve a simple cipher to reveal contact info.
   The answer is: MAHAD  (encoded as Base64 chunks below)
══════════════════════════════════════════════════════════ */

const PUZZLE = {
  // "MAHAD" XOR'd with key 5, then hex-encoded
  ciphertext: "48 4C 4D 40 41",
  hint1: "XOR each hex byte with decimal 5",
  hint2: "The result is ASCII uppercase letters",
  hint3: "It's the first name of this portfolio's owner",
  answer: "MAHAD",
  flag: "CTF{mahad_sh4h_contact_unl0ck3d}",
};

interface ContactGateProps {
  children: React.ReactNode;
}

export function ContactGate({ children }: ContactGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [glitchActive, setGlitchActive] = useState(false);
  const [grantedActive, setGrantedActive] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);
  const [showCipher, setShowCipher] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const hints = [PUZZLE.hint1, PUZZLE.hint2, PUZZLE.hint3];

  // ── Removed localStorage check so gate is always locked on refresh ──

  // Hint cycling every 20 seconds
  useEffect(() => {
    if (unlocked) return;
    const t = setInterval(() => {
      setHintIdx((i) => (i + 1) % hints.length);
    }, 20000);
    return () => clearInterval(t);
  }, [unlocked, hints.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = input.trim().toUpperCase();

    if (guess === PUZZLE.answer) {
      soundManager.success();
      setGrantedActive(true);
      setTimeout(() => {
        setUnlocked(true);
        // ── Removed localStorage.setItem so unlock is session-only ──
      }, 1200);
    } else {
      soundManager.error();
      setGlitchActive(true);
      setAttempts((a) => Math.max(0, a - 1));
      setInput("");
      setTimeout(() => setGlitchActive(false), 800);
      if (attempts <= 1) {
        // Auto-unlock after running out (don't block the user forever)
        setTimeout(() => {
          setHintIdx(2);
        }, 500);
      }
    }
  };

  if (unlocked) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Unlock className="w-3.5 h-3.5 text-green-500" />
          <span className="text-[10px] font-mono text-green-500 tracking-widest uppercase">
            Access Granted — {PUZZLE.flag}
          </span>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Blurred children behind the gate */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          filter: "blur(6px) brightness(0.4)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {children}
      </div>

      {/* Gate overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
          glitchActive ? "gate-glitch" : ""
        } ${grantedActive ? "gate-granted" : ""}`}
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(2px)",
          border: glitchActive
            ? "1px solid rgba(255,32,32,0.8)"
            : grantedActive
              ? "1px solid rgba(0,255,65,0.8)"
              : "1px solid rgba(255,32,32,0.2)",
          boxShadow: grantedActive ? "0 0 40px rgba(0,255,65,0.3)" : undefined,
        }}
      >
        {grantedActive ? (
          <div className="text-center animate-pulse">
            <Unlock className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-mono text-sm font-bold tracking-widest">
              ACCESS GRANTED
            </p>
          </div>
        ) : (
          <div className="w-full max-w-xs px-6 py-5 text-center">
            <Lock className="w-8 h-8 text-red-500/70 mx-auto mb-3" />
            <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-widest mb-1">
              Contact Locked
            </p>
            <p className="text-[10px] text-zinc-600 font-mono mb-4">
              Solve the cipher to reveal contact info
            </p>

            {/* Cipher display */}
            <button
              onClick={() => setShowCipher(!showCipher)}
              className="flex items-center gap-1.5 mx-auto mb-3 text-[10px] text-red-400/70 font-mono hover:text-red-400 transition-colors"
            >
              {showCipher ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {showCipher ? "Hide" : "Show"} cipher
            </button>

            {showCipher && (
              <div className="mb-4 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-left">
                <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mb-1">
                  Ciphertext (Hex):
                </p>
                <p className="text-[11px] text-red-400 font-mono tracking-widest mb-2">
                  {PUZZLE.ciphertext}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-mono">
                  <Terminal className="w-3 h-3" />
                  <span>
                    Hint {hintIdx + 1}/3: {hints[hintIdx]}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder="ENTER FLAG"
                maxLength={20}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-center text-sm font-mono text-white placeholder-zinc-700 outline-none focus:border-red-500/50 tracking-widest transition-colors"
                style={{ letterSpacing: "0.2em" }}
                autoComplete="off"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-600/20 border border-red-700/40 rounded-lg text-[11px] font-mono text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-200 tracking-widest uppercase"
              >
                Decrypt
              </button>
            </form>

            {attempts < 3 && (
              <p className="mt-2 text-[9px] text-red-500/60 font-mono">
                {attempts > 0
                  ? `${attempts} attempt${attempts !== 1 ? "s" : ""} remaining`
                  : "Hint 3 unlocked — try again"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

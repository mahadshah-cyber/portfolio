"use client";

import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   Fake Kali Linux GNOME Desktop
   Displayed after boot sequence before transitioning to portfolio
══════════════════════════════════════════════════════════ */

interface KaliDesktopProps {
  onLaunch: () => void;
}

function ClockWidget() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center">
      <span className="text-white text-sm font-light tabular-nums">
        {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="text-white/60 text-[10px]">
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </span>
    </div>
  );
}

const DESKTOP_ICONS = [
  {
    id: "portfolio",
    label: "Mahad's Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.5" />
        <path d="M8 21h8M12 17v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 8l3 3 5-5" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    isMain: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <rect x="2" y="3" width="20" height="18" rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
        <path d="M6 8l4 4-4 4" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 16h4" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "ctf",
    label: "CTF-Tools",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#ff4444" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ff4444" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "browser",
    label: "Firefox",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
        <circle cx="12" cy="12" r="9" stroke="#ff6b00" strokeWidth="1.5" />
        <path d="M12 3C12 3 8 7 8 12s4 9 4 9" stroke="#ff6b00" strokeWidth="1.5" />
        <path d="M3 12h18" stroke="#ff6b00" strokeWidth="1.5" />
        <path d="M12 3a9 9 0 0 1 6 9" stroke="#ff9900" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function KaliDesktop({ onLaunch }: KaliDesktopProps) {
  const [doubleClickTarget, setDoubleClickTarget] = useState<string | null>(null);
  const [openingMain, setOpeningMain] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<Record<string, number>>({});

  const handleIconClick = (id: string, isMain: boolean) => {
    setSelectedIcon(id);
    const count = (clickCount[id] || 0) + 1;
    setClickCount((prev) => ({ ...prev, [id]: count }));

    if (count >= 2 || doubleClickTarget === id) {
      if (isMain) {
        setOpeningMain(true);
        setTimeout(() => onLaunch(), 800);
      }
      setDoubleClickTarget(null);
      setClickCount((prev) => ({ ...prev, [id]: 0 }));
    } else {
      setDoubleClickTarget(id);
      setTimeout(() => {
        setDoubleClickTarget(null);
        setClickCount((prev) => ({ ...prev, [id]: 0 }));
      }, 500);
    }
  };

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #0d1117 40%, #0a1a0a 100%)",
      }}
    >
      {/* Top GNOME bar */}
      <div
        className="flex items-center justify-between px-4 h-9 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      >
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-xs font-medium">Activities</span>
          <span className="text-white/50 text-xs">▾ Kali Linux</span>
        </div>
        <ClockWidget />
        <div className="flex items-center gap-3">
          {/* System tray icons */}
          <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 opacity-70">
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 opacity-70">
            <rect x="2" y="7" width="16" height="10" rx="1" stroke="white" strokeWidth="1.5" />
            <path d="M22 11v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <rect x="4" y="9" width="10" height="6" rx="0.5" fill="white" />
          </svg>
          <span className="text-white/70 text-xs">100%</span>
          <div className="w-px h-3 bg-white/20" />
          <span className="text-white/70 text-[10px]">mahad</span>
        </div>
      </div>

      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden p-4">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Desktop icons grid (top-left, column layout) */}
        <div className="absolute top-4 right-4 flex flex-col gap-4">
          {DESKTOP_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconClick(icon.id, icon.isMain || false)}
              className={`flex flex-col items-center gap-1.5 w-20 p-2 rounded-lg transition-all duration-150 group select-none ${
                selectedIcon === icon.id ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
              } ${icon.isMain ? "order-first" : ""}`}
            >
              <div className={`transition-transform duration-150 ${selectedIcon === icon.id && openingMain ? "scale-110" : "group-hover:scale-105"}`}>
                {icon.icon}
              </div>
              <span
                className="text-[10px] text-white/80 text-center leading-tight font-medium"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              >
                {icon.isMain ? (
                  <span className="text-green-300">{icon.label}</span>
                ) : icon.label}
              </span>
            </button>
          ))}
        </div>

        {/* Center hint */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div
              className={`transition-all duration-500 ${openingMain ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            >
              <div className="px-6 py-3 rounded-xl bg-black/60 border border-green-500/30 backdrop-blur">
                <p className="text-green-400 font-mono text-sm tracking-widest animate-pulse">
                  LAUNCHING PORTFOLIO...
                </p>
              </div>
            </div>
            {!openingMain && (
              <p className="text-white/30 text-xs font-light mt-2">
                Double-click the portfolio icon to launch →
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom dock */}
      <div
        className="flex items-center justify-center gap-2 px-6 h-16 flex-shrink-0"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {[
          { label: "Files", color: "#4a9eff" },
          { label: "Terminal", color: "#00ff41" },
          { label: "Firefox", color: "#ff6b00" },
          { label: "Wireshark", color: "#2c5aa0" },
          { label: "Burp Suite", color: "#f97316" },
          { label: "Metasploit", color: "#ef4444" },
        ].map(({ label, color }) => (
          <button
            key={label}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-150 group relative"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.05)" }}
            title={label}
          >
            <span className="text-[10px] font-bold" style={{ color }}>{label[0]}</span>
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

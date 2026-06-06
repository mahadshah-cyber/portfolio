"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, Activity, Globe, Terminal, Lock } from "lucide-react";

/* ══════════════════════════════════════════════════════════
   SECRET WAR ROOM — /warroom
   Accessible via: Konami Code, or 'sudo --override' in terminal
══════════════════════════════════════════════════════════ */

const INCIDENT_LOG = [
  { time: "14:02:33", level: "CRIT",  msg: "Unauthorized port scan detected — src: 45.33.32.156" },
  { time: "14:01:55", level: "WARN",  msg: "Repeated auth failures on SSH port 22 — blocked" },
  { time: "14:00:21", level: "INFO",  msg: "Firewall ruleset updated — 2048 entries active" },
  { time: "13:58:44", level: "CRIT",  msg: "SQLi probe on /api/contact — request sanitized" },
  { time: "13:57:12", level: "WARN",  msg: "Unusual traffic spike: 4,200 req/min from 203.0.113.0" },
  { time: "13:55:00", level: "INFO",  msg: "DDoS protection layer refreshed — CF Workers online" },
  { time: "13:52:31", level: "CRIT",  msg: "XSS payload attempted on blog endpoint — blocked" },
  { time: "13:50:15", level: "INFO",  msg: "SSL cert renewed — expires 2027-06-06" },
  { time: "13:47:08", level: "WARN",  msg: "Tor exit node request flagged — challenge issued" },
  { time: "13:44:22", level: "INFO",  msg: "SIEM correlation rule triggered: brute-force pattern" },
];

const THREAT_NODES = [
  { x: 15, y: 25, label: "RU", threat: true },
  { x: 45, y: 20, label: "CN", threat: true },
  { x: 72, y: 35, label: "US", threat: false },
  { x: 30, y: 60, label: "BR", threat: false },
  { x: 85, y: 55, label: "AU", threat: false },
  { x: 55, y: 45, label: "EU", threat: false },
  { x: 65, y: 22, label: "KZ", threat: true },
  { x: 20, y: 70, label: "ZA", threat: false },
  { x: 60, y: 65, label: "IN", threat: false },
];

// Your location (Pakistan)
const HOME_NODE = { x: 62, y: 38 };

function ThreatMap() {
  const [pulseStep, setPulseStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulseStep((s) => s + 1), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full aspect-[2/1] bg-[#030a03] rounded-xl border border-green-900/30 overflow-hidden">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 50">
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="50" stroke="#00ff41" strokeWidth="0.2" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#00ff41" strokeWidth="0.2" />
        ))}
        {/* Rough continent outlines (simplified) */}
        <path d="M5 15 Q12 10 20 18 Q25 25 20 35 Q15 40 10 35 Z" fill="rgba(0,100,0,0.15)" stroke="#00ff41" strokeWidth="0.3" />
        <path d="M30 8 Q50 5 60 15 Q70 20 65 35 Q55 42 45 38 Q35 35 32 25 Z" fill="rgba(0,100,0,0.15)" stroke="#00ff41" strokeWidth="0.3" />
        <path d="M70 10 Q85 8 92 20 Q95 30 90 40 Q82 45 78 38 Q72 30 70 20 Z" fill="rgba(0,100,0,0.15)" stroke="#00ff41" strokeWidth="0.3" />
        <path d="M35 42 Q45 40 50 48 Q45 50 38 48 Z" fill="rgba(0,100,0,0.1)" stroke="#00ff41" strokeWidth="0.3" />
      </svg>

      {/* Attack lines from threat nodes to home */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
        {THREAT_NODES.filter((n) => n.threat).map((node, i) => (
          <line
            key={i}
            x1={node.x}
            y1={node.y}
            x2={HOME_NODE.x}
            y2={HOME_NODE.y}
            stroke="rgba(255,32,32,0.3)"
            strokeWidth="0.4"
            strokeDasharray="1 2"
            style={{
              animation: `dash ${1.5 + i * 0.3}s linear infinite`,
              opacity: 0.5 + (pulseStep % 3 === i % 3 ? 0.4 : 0),
            }}
          />
        ))}
      </svg>

      {/* Threat nodes */}
      {THREAT_NODES.map((node) => (
        <div
          key={node.label}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className={`relative w-2 h-2 rounded-full ${node.threat ? "bg-red-500" : "bg-green-500"}`}
          >
            {node.threat && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
            )}
          </div>
          <span
            className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[6px] font-mono whitespace-nowrap"
            style={{ color: node.threat ? "#ff4444" : "#00ff41" }}
          >
            {node.label}
          </span>
        </div>
      ))}

      {/* Home node (Pakistan) */}
      <div
        className="absolute"
        style={{ left: `${HOME_NODE.x}%`, top: `${HOME_NODE.y}%`, transform: "translate(-50%, -50%)" }}
      >
        <div className="relative w-3 h-3 rounded-full bg-cyan-400">
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-40" />
        </div>
        <span className="absolute top-3.5 left-1/2 -translate-x-1/2 text-[7px] font-mono text-cyan-400 whitespace-nowrap">YOU</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[7px] text-red-400 font-mono">Threat</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[7px] text-green-400 font-mono">Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[7px] text-cyan-400 font-mono">Operator</span>
        </div>
      </div>
    </div>
  );
}

function LiveIncidentLog() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [newEntry, setNewEntry] = useState<{ time: string; level: string; msg: string } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const randomEntries = [
        { time: new Date().toTimeString().slice(0, 8), level: "WARN", msg: "Automated crawler detected — rate limited" },
        { time: new Date().toTimeString().slice(0, 8), level: "INFO", msg: "Health check passed — all services nominal" },
        { time: new Date().toTimeString().slice(0, 8), level: "CRIT", msg: "Suspicious payload in request headers — dropped" },
      ];
      setNewEntry(randomEntries[Math.floor(Math.random() * randomEntries.length)]);
      setVisibleCount((c) => Math.min(c + 1, INCIDENT_LOG.length));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [newEntry]);

  return (
    <div ref={logRef} className="space-y-1 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {newEntry && (
        <div className="flex items-start gap-2 text-[10px] font-mono animate-fade-in-up">
          <span className="text-zinc-600 shrink-0">{newEntry.time}</span>
          <span className={`shrink-0 px-1 rounded text-[9px] ${
            newEntry.level === "CRIT" ? "bg-red-950 text-red-400" :
            newEntry.level === "WARN" ? "bg-yellow-950 text-yellow-400" :
            "bg-green-950 text-green-400"
          }`}>{newEntry.level}</span>
          <span className="text-zinc-400">{newEntry.msg}</span>
        </div>
      )}
      {INCIDENT_LOG.slice(0, visibleCount).map((entry, i) => (
        <div key={i} className="flex items-start gap-2 text-[10px] font-mono">
          <span className="text-zinc-600 shrink-0">{entry.time}</span>
          <span className={`shrink-0 px-1 rounded text-[9px] ${
            entry.level === "CRIT" ? "bg-red-950 text-red-400" :
            entry.level === "WARN" ? "bg-yellow-950 text-yellow-400" :
            "bg-green-950 text-green-400"
          }`}>{entry.level}</span>
          <span className="text-zinc-400">{entry.msg}</span>
        </div>
      ))}
    </div>
  );
}

export default function WarRoom() {
  const router = useRouter();
  const [visitorInfo, setVisitorInfo] = useState({ browser: "", os: "", time: "" });
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if hacker mode is active
    try {
      if (localStorage.getItem("hacker-mode") !== "true") {
        // Allow access but show warning — don't block
      }
    } catch { /* ignore */ }
    setAuthorized(true);

    // "Profile" the visitor
    const ua = navigator.userAgent;
    const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Unknown";
    const os = ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "macOS" : ua.includes("Linux") ? "Linux" : "Unknown";
    setVisitorInfo({ browser, os, time: new Date().toISOString() });
  }, []);

  if (!authorized) return null;

  return (
    <div
      className="min-h-screen bg-[#020302] text-green-400 p-4 lg:p-6 font-mono"
      style={{ backgroundImage: "radial-gradient(ellipse at top left, rgba(0,40,0,0.15), transparent 50%)" }}
    >
      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* CLASSIFIED watermark */}
      <div
        className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
        style={{ transform: "rotate(-35deg)" }}
      >
        <span className="text-red-900/10 font-bold tracking-[0.5em] uppercase select-none"
          style={{ fontSize: "clamp(40px, 8vw, 100px)" }}>
          CLASSIFIED
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-7 h-7 text-green-400" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Shield className="w-7 h-7 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase text-green-300">
                Mahad-Sec Operations Center
              </h1>
              <p className="text-[9px] text-green-700 tracking-widest">
                CLEARANCE LEVEL 5 — AUTHORIZED ACCESS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-950/40 border border-red-900/30">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-400 tracking-widest">LIVE</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-950/30 border border-green-900/30 hover:bg-green-950/50 text-[10px] text-green-400 hover:text-green-300 transition-all"
            >
              ← Exit War Room
            </button>
          </div>
        </div>

        {/* Visitor profiling alert */}
        <div className="mb-4 p-3 rounded-lg bg-yellow-950/20 border border-yellow-900/20 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-[10px] text-yellow-400/80">
            <span className="font-bold">VISITOR PROFILED: </span>
            Browser: <span className="text-yellow-300">{visitorInfo.browser}</span> |
            OS: <span className="text-yellow-300">{visitorInfo.os}</span> |
            Access Time: <span className="text-yellow-300">{visitorInfo.time}</span>
            <span className="text-yellow-600 ml-2">(this is what a real attacker sees about you)</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Threat Map — full width */}
          <div className="lg:col-span-3">
            <div className="p-4 rounded-xl bg-black/50 border border-green-900/20">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-green-400">Global Threat Map</span>
                <div className="ml-auto flex items-center gap-1.5 text-[9px] text-green-700">
                  <Activity className="w-3 h-3" />
                  <span>Real-time simulation</span>
                </div>
              </div>
              <ThreatMap />
            </div>
          </div>

          {/* Incident Log */}
          <div className="lg:col-span-2">
            <div className="p-4 rounded-xl bg-black/50 border border-green-900/20 h-full">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-green-400">Incident Log</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>
              <LiveIncidentLog />
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-3">
            {[
              { label: "Threats Blocked", value: "1,337", icon: Shield, color: "text-red-400" },
              { label: "Uptime", value: "99.97%", icon: Activity, color: "text-green-400" },
              { label: "Active Listeners", value: "12", icon: Terminal, color: "text-cyan-400" },
              { label: "Encryption", value: "AES-256", icon: Lock, color: "text-yellow-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-3 rounded-lg bg-black/50 border border-green-900/20 flex items-center gap-3">
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <div>
                  <p className="text-[9px] text-green-700 uppercase tracking-widest">{label}</p>
                  <p className={`text-sm font-bold ${color} font-mono`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-[9px] text-green-900 font-mono">
            This page is accessible via: Konami Code (↑↑↓↓←→←→BA) | Terminal: sudo --override | Direct: /warroom
          </p>
        </div>
      </div>
    </div>
  );
}

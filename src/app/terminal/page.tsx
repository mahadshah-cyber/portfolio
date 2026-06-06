"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { soundManager } from "@/lib/sound";
import { processCommand, LogLine, resetTerminalState } from "@/lib/terminal-commands";
import { hackerMode } from "@/lib/hacker-mode";
import { Terminal as TermIcon, Volume2, VolumeX, ArrowLeft, Maximize2, Minimize2 } from "lucide-react";

const WELCOME_LINES: LogLine[] = [
  { text: "╔══════════════════════════════════════════════════════════╗", type: "ascii" },
  { text: "║         MAHAD-SEC TERMINAL  v4.26  SECURE SHELL          ║", type: "ascii" },
  { text: "║      Operator: Syed Mahad Shah  |  Node: kali-sec-4      ║", type: "ascii" },
  { text: "╚══════════════════════════════════════════════════════════╝", type: "ascii" },
  { text: "", type: "output" },
  { text: "CONNECTION SECURED. Encryption: AES-256-GCM", type: "success" },
  { text: "Type 'help' to list all system directives.", type: "output" },
  { text: "Easter eggs are hidden — explore carefully. 👀", type: "output" },
  { text: "", type: "output" },
];

export default function TerminalPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [mute, setMute] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [matrixActive, setMatrixActive] = useState(false);
  const [hackNasaActive, setHackNasaActive] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sudoAttempts, setSudoAttempts] = useState(0);
  const [decryptMode, setDecryptMode] = useState(false);

  // NASA hacking sequence state
  const [nasaStep, setNasaStep] = useState(0);
  const nasaLines = [
    "Initiating breach sequence...",
    "Bypassing firewall — NASA GSFC:443...",
    "Injecting SQL payload...",
    "Database tables exposed: 2,847 records",
    "Downloading satellite telemetry data...",
    "Uploading custom firmware to ISS Node...",
    "ALERT: Countermeasure deployed by NASA CISO",
    "Emergency exit protocol activated — purging logs...",
    "✓ Session scrubbed. No trace left.",
    "",
    "(Just kidding — this is a demo. Please don't actually hack NASA 😅)",
    "— Syed Mahad Shah",
  ];

  const bufferEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nasaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Boot sequence
  useEffect(() => {
    resetTerminalState();
    let i = 0;
    const t = setInterval(() => {
      if (i < WELCOME_LINES.length) {
        setLogs((prev) => [...prev, WELCOME_LINES[i]]);
        i++;
      } else {
        clearInterval(t);
        soundManager.success();
      }
    }, 60);
    return () => clearInterval(t);
  }, []);

  // NASA hack animation
  useEffect(() => {
    if (!hackNasaActive) return;
    if (nasaIntervalRef.current) clearInterval(nasaIntervalRef.current);
    setNasaStep(0);
    let step = 0;
    nasaIntervalRef.current = setInterval(() => {
      if (step >= nasaLines.length) {
        setHackNasaActive(false);
        setNasaStep(0);
        if (nasaIntervalRef.current) clearInterval(nasaIntervalRef.current);
        return;
      }
      const line = nasaLines[step];
      const type = step >= 9 ? "success" : step >= 6 ? "error" : "system";
      setLogs((prev) => [...prev, { text: `  ${line}`, type }]);
      step++;
      setNasaStep(step);
    }, 600);
    return () => { if (nasaIntervalRef.current) clearInterval(nasaIntervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackNasaActive]);

  // Matrix canvas
  useEffect(() => {
    if (!matrixActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || 600;
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF";
    const cols = Math.floor(canvas.width / 11);
    const drops = Array(cols).fill(1);
    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "11px monospace";
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 11, drops[i] * 11);
        if (drops[i] * 11 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [matrixActive]);

  // Auto-scroll
  useEffect(() => {
    bufferEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const focusInput = useCallback(() => {
    if (!matrixActive) inputRef.current?.focus();
  }, [matrixActive]);

  useEffect(() => { focusInput(); }, [matrixActive, focusInput]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      // Basic tab completion
      const commands = ["help","whoami","about","skills","projects","ctf","ls","cat","cd","pwd",
        "uname","ifconfig","ps","nmap","sudo","curl","history","neofetch","decrypt",
        "matrix","hack","guitar","clear","exit"];
      const match = commands.find((c) => c.startsWith(inputVal));
      if (match) setInputVal(match);
      return;
    }
    if (!mute && e.key.length === 1) soundManager.tick();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInputVal(cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx + 1;
      if (next >= cmdHistory.length) { setHistIdx(-1); setInputVal(""); }
      else { setHistIdx(next); setInputVal(cmdHistory[next]); }
      return;
    }
    if (e.key !== "Enter") return;
    const cmd = inputVal.trim();
    if (!cmd) return;
    if (!mute) soundManager.click();

    const newLogs: LogLine[] = [
      ...logs,
      { text: `mahad@kali-sec:${getCwd()}$ ${cmd}`, type: "input" },
    ];
    setLogs(newLogs);
    setInputVal("");
    setCmdHistory((h) => [...h, cmd]);
    setHistIdx(-1);

    // Decrypt mode intercept
    if (decryptMode) {
      let answer = "";
      try { answer = sessionStorage.getItem("decrypt-answer") || ""; } catch { /* ignore */ }
      if (cmd === answer) {
        setDecryptMode(false);
        setLogs([...newLogs,
          { text: "✓ PAYLOAD DECRYPTED SUCCESSFULLY!", type: "success" },
          { text: "FLAG: CTF{m4h4d_5h4h_d3cr1pt_ch4mp}", type: "success" },
          { text: "🔓 ACCESS GRANTED — TOKEN ISSUED", type: "success" },
          { text: "", type: "output" },
        ]);
        soundManager.success();
      } else {
        setLogs([...newLogs,
          { text: "✗ WRONG ANSWER. Try again (or type 'cancel'):", type: "error" },
        ]);
        soundManager.error();
      }
      return;
    }
    if (cmd === "cancel" && decryptMode) { setDecryptMode(false); return; }

    if (matrixActive) { setMatrixActive(false); return; }

    await processCommand(cmd, newLogs, {
      setLogs,
      setMatrixActive,
      setHackNasaActive,
      routerPush: (path) => router.push(path),
      activateHackerMode: () => hackerMode?.activate(),
      getSudoAttempts: () => sudoAttempts,
      setSudoAttempts,
    });

    // Check if decrypt mode should be activated
    if (cmd.startsWith("decrypt")) setDecryptMode(true);
  };

  function getCwd() { return "~"; }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    setFullscreen(!fullscreen);
  };

  return (
    <div
      className="min-h-screen bg-[#020202] flex items-center justify-center p-2 md:p-4 lg:p-6 overflow-hidden relative selection:bg-green-500/40 selection:text-white"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      {/* Scanlines */}
      {scanlines && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 15,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />
      )}
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,40,0,0.15),transparent_70%)] pointer-events-none" style={{ zIndex: 1 }} />

      {/* CRT Terminal Box */}
      <div
        ref={containerRef}
        onClick={focusInput}
        className="w-full max-w-5xl rounded-2xl bg-[#040804] border border-green-900/40 relative overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,255,0,0.08),0_0_120px_rgba(0,255,0,0.03)] cursor-text"
        style={{ zIndex: 10, height: "clamp(400px, 82vh, 900px)" }}
      >
        {/* CRT border glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-green-500/10" style={{ boxShadow: "inset 0 0 40px rgba(0,255,0,0.04)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#060906] border-b border-green-900/30 flex-shrink-0 relative z-20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600/80 hover:bg-red-500 transition-colors cursor-pointer" onClick={() => router.push("/")} title="Close" />
            <span className="w-3 h-3 rounded-full bg-yellow-600/80" />
            <span className="w-3 h-3 rounded-full bg-green-600/80" />
            <div className="flex items-center gap-2 ml-3">
              <TermIcon className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase">
                mahad@kali-sec — bash — 120×40
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); setScanlines(!scanlines); }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                scanlines ? "border-green-800 text-green-500 bg-green-950/30" : "border-zinc-800 text-zinc-600"
              }`}
              title="Toggle CRT scanlines"
            >CRT</button>
            <button
              onClick={(e) => { e.stopPropagation(); setMute(!mute); }}
              className="text-green-600 hover:text-green-400 p-1 transition-colors"
              title={mute ? "Unmute" : "Mute"}
            >
              {mute ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="text-green-600 hover:text-green-400 p-1 transition-colors"
              title="Fullscreen"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-green-950/20 border border-green-900/30 hover:bg-green-950/40 text-[10px] font-mono tracking-wider text-green-400 hover:text-green-300 transition-all"
              onClick={() => { if (!mute) soundManager.click(); }}
            >
              <ArrowLeft className="w-3 h-3" />
              Home
            </Link>
          </div>
        </div>

        {/* Matrix Overlay */}
        {matrixActive && (
          <div
            className="absolute inset-0 z-40 bg-black cursor-pointer"
            onClick={() => setMatrixActive(false)}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 border border-green-500 text-green-400 font-mono text-xs rounded animate-pulse select-none">
              MATRIX ENGINE ACTIVE — click anywhere to exit
            </div>
          </div>
        )}

        {/* Log Buffer */}
        <div className="flex-1 p-4 lg:p-5 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col">
          <div className="flex-1 space-y-0.5">
            {logs.map((log, i) => {
              if (!log || !log.type) return null;
              return (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {log.type === "input" ? (
                    <div className="flex items-start gap-1">
                      <span className="text-green-500 font-bold shrink-0">$</span>
                      <span className="text-zinc-100">{log.text.split("$ ").slice(1).join("$ ")}</span>
                    </div>
                  ) : log.type === "ascii" ? (
                    <pre className="text-green-400 leading-tight overflow-x-auto select-none">{log.text}</pre>
                  ) : log.type === "error" ? (
                    <span className="text-red-400">{log.text}</span>
                  ) : log.type === "success" ? (
                    <span className="text-cyan-300 font-semibold">{log.text}</span>
                  ) : log.type === "system" ? (
                    <span className="text-green-300 tracking-wide">{log.text}</span>
                  ) : log.type === "warn" ? (
                    <span className="text-yellow-400">{log.text}</span>
                  ) : (
                    <span className="text-green-500/80">{log.text}</span>
                  )}
                </div>
              );
            })}
            <div ref={bufferEndRef} />
          </div>

          {/* Input line */}
          {!matrixActive && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-950/30 flex-shrink-0">
              <span className="text-green-400 font-bold shrink-0 text-[11px]">
                mahad@kali-sec:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-green-950/50 caret-green-400 text-xs p-0 focus:ring-0"
                placeholder={decryptMode ? "Enter decrypted word..." : "Type a command... (Tab to autocomplete)"}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hacker Mode hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] text-green-900/50 font-mono select-none">
        Try: ↑↑↓↓←→←→BA for a surprise
      </div>
    </div>
  );
}

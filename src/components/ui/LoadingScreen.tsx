"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";

/* ─────────────────────────────────────────────────────────────
   Kali Linux – authentic boot log lines
───────────────────────────────────────────────────────────── */
const BOOT_LINES = [
  { text: "[    0.000000] Linux version 6.6.9-amd64 (Kali 6.6.9-1kali1)", delay: 0 },
  { text: "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.6.9-amd64", delay: 100 },
  { text: "[    0.023451] BIOS-provided physical RAM map:", delay: 200 },
  { text: "[    0.048123] ACPI: IRQ0 used by override.", delay: 300 },
  { text: "[    0.121345] PCI: Using configuration type 1 for base access", delay: 400 },
  { text: "[    0.198234] clocksource: tsc-early: mask: 0xfff...", delay: 480 },
  { text: "[    0.287654] Initializing cgroup subsys cpuset", delay: 560 },
  { text: "[    0.312000] NET: Registered PF_INET6 protocol family", delay: 640 },
  { text: "[    0.421987] cryptd: max_cpu_qlen set to 1000", delay: 720 },
  { text: "[    0.488123] Loading kernel crypto modules: aes sha256 hmac", delay: 800 },
  { text: "[    0.534512] iptables: Applying firewall ruleset — 2048 entries", delay: 880 },
  { text: "[    0.612345] wlan0: IEEE 802.11 monitoring mode enabled", delay: 950 },
  { text: "[    0.698765] systemd[1]: Starting Kali Linux...", delay: 1020 },
  { text: "[    0.712345] systemd[1]: Reached target — Basic System", delay: 1100 },
  { text: "[    0.823456] SMS Portfolio v2.2.6 — Secure Environment Ready", delay: 1180 },
  { text: "[    0.934567] operator@kali:~$ _", delay: 1280 },
];

/* ─────────────────────────────────────────────────────────────
   Authentic Kali Linux Dragon SVG
   Based on the actual Kali logo — the iconic dragon silhouette
───────────────────────────────────────────────────────────── */
function KaliDragon() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="kali-dragon-svg"
      aria-label="Kali Linux Dragon"
    >
      <defs>
        <filter id="dragonGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="dragonBodyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
        </radialGradient>
      </defs>

      {/* ── BODY — main S-curve spine ── */}
      <path
        className="dragon-path"
        d="M 252 42
           C 268 38, 295 44, 318 62
           C 341 80, 352 108, 345 135
           C 338 162, 318 178, 298 192
           C 278 206, 258 215, 248 235
           C 238 255, 240 278, 252 296
           C 264 314, 282 322, 295 335
           C 308 348, 312 365, 305 382
           C 298 399, 282 410, 265 415"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* ── NECK ── */}
      <path
        className="dragon-path"
        d="M 252 42
           C 238 34, 218 26, 204 35
           C 190 44, 188 64, 196 78
           C 204 92, 222 98, 234 110
           C 246 122, 250 140, 246 158"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* ── HEAD ── */}
      <path
        className="dragon-path"
        d="M 204 35
           C 196 24, 182 14, 168 10
           C 154 6, 138 10, 130 22
           C 122 34, 126 52, 138 62
           C 150 72, 168 70, 178 82"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* ── SNOUT / JAW ── */}
      <path
        className="dragon-path"
        d="M 130 22
           C 118 18, 104 22, 96 34
           C 88 46, 92 62, 106 70
           C 120 78, 138 72, 148 58"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* ── HORN 1 ── */}
      <path
        className="dragon-path"
        d="M 172 14 C 180 2, 188 -6, 198 -2 C 202 0, 202 6, 196 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── HORN 2 (smaller) ── */}
      <path
        className="dragon-path"
        d="M 158 10 C 162 0, 168 -4, 174 -1"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* ── EYE ── */}
      <circle
        className="dragon-eye"
        cx="144"
        cy="36"
        r="5"
        fill="white"
        filter="url(#eyeGlow)"
      />
      <circle cx="144" cy="36" r="2.5" fill="#cc0000" />
      <circle cx="142.5" cy="34.5" r="1" fill="white" opacity="0.6" />

      {/* ── EAR / CREST ── */}
      <path
        className="dragon-path"
        d="M 162 18 C 154 8, 148 4, 154 -2 C 158 -6, 166 -2, 168 8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* ── LARGE WING (left) ── */}
      <path
        className="dragon-wing"
        d="M 246 158
           C 230 136, 196 110, 158 112
           C 120 114, 86 136, 70 165
           C 54 194, 60 228, 82 248
           C 104 268, 138 272, 166 260
           C 194 248, 212 224, 228 202
           C 244 180, 246 158, 246 158 Z"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.04)"
        filter="url(#dragonGlow)"
      />

      {/* Wing membrane lines */}
      <path className="dragon-wing" d="M 246 158 C 214 150, 178 148, 138 158" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
      <path className="dragon-wing" d="M 240 178 C 206 168, 168 166, 120 180" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
      <path className="dragon-wing" d="M 234 200 C 200 188, 160 186, 106 202" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.35" />
      <path className="dragon-wing" d="M 226 220 C 194 210, 155 208, 98 224" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* Wing tips / claws on left wing */}
      <path className="dragon-wing" d="M 70 165 C 52 162, 42 170, 44 182 C 46 188, 54 190, 62 186" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
      <path className="dragon-wing" d="M 60 195 C 44 196, 34 206, 38 218 C 40 224, 50 226, 58 220" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.65" />

      {/* ── SMALLER WING (right) ── */}
      <path
        className="dragon-wing"
        d="M 298 192
           C 318 172, 350 160, 382 164
           C 414 168, 438 190, 440 218
           C 442 246, 422 268, 396 274
           C 370 280, 342 266, 326 246
           C 310 226, 300 206, 298 192 Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.04)"
        filter="url(#dragonGlow)"
      />

      {/* Right wing membranes */}
      <path className="dragon-wing" d="M 298 192 C 322 184, 354 182, 390 192" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.45" />
      <path className="dragon-wing" d="M 296 212 C 322 204, 356 202, 400 214" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.38" />
      <path className="dragon-wing" d="M 294 232 C 320 224, 355 222, 398 234" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />

      {/* Right wing tip claw */}
      <path className="dragon-wing" d="M 440 218 C 456 216, 464 228, 460 240 C 456 248, 446 248, 440 242" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.65" />

      {/* ── SPINE SPIKES ── */}
      <path className="dragon-path" d="M 268 52 C 274 38, 280 30, 288 28" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75" />
      <path className="dragon-path" d="M 290 80 C 298 66, 306 58, 314 56" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
      <path className="dragon-path" d="M 306 112 C 316 98, 324 90, 332 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.65" />
      <path className="dragon-path" d="M 308 148 C 318 136, 326 128, 334 126" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* ── FRONT LEGS / CLAWS ── */}
      <path
        className="dragon-path"
        d="M 166 260
           C 158 274, 148 286, 138 290
           M 166 260
           C 162 278, 155 292, 150 298
           M 166 260
           C 168 278, 165 292, 162 300
           M 166 260
           C 175 276, 175 292, 172 300"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* ── BACK LEGS / CLAWS ── */}
      <path
        className="dragon-path"
        d="M 265 415
           C 256 428, 248 440, 240 444
           M 265 415
           C 260 430, 255 444, 252 452
           M 265 415
           C 267 430, 265 446, 264 454
           M 265 415
           C 274 430, 274 446, 272 454"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* ── TAIL CURL ── */}
      <path
        className="dragon-path"
        d="M 265 415
           C 280 425, 296 422, 306 410
           C 316 398, 316 382, 306 372
           C 296 362, 280 362, 272 374
           C 264 386, 268 400, 278 406
           C 288 412, 298 408, 302 398"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#dragonGlow)"
      />

      {/* ── OUTER GLOW RING (atmospheric) ── */}
      <ellipse
        cx="250"
        cy="240"
        rx="210"
        ry="210"
        stroke="rgba(180,0,0,0.06)"
        strokeWidth="1"
        fill="none"
      />
      <ellipse
        cx="250"
        cy="240"
        rx="185"
        ry="185"
        stroke="rgba(255,32,32,0.04)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Particle type
───────────────────────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 0.8,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 10 + 7,
    delay: Math.random() * 6,
  }));
}

/* ─────────────────────────────────────────────────────────────
   Main LoadingScreen
───────────────────────────────────────────────────────────── */
export function LoadingScreen() {
  const screenRef   = useRef<HTMLDivElement>(null);
  const dragonRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pctRef      = useRef<HTMLSpanElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLSpanElement>(null);

  const [hidden, setHidden]           = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [particles, setParticles]     = useState<Particle[]>([]);

  /* Boot log timer — client only */
  const addLines = useCallback(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
    });
  }, []);

  /* Client-only init */
  useEffect(() => {
    setParticles(generateParticles(50));
    addLines();
  }, [addLines]);

  /* GSAP animation */
  useEffect(() => {
    const screen   = screenRef.current;
    const dragon   = dragonRef.current;
    const bar      = progressRef.current;
    const glow     = glowRef.current;
    const status   = statusRef.current;
    if (!screen || !dragon || !bar) return;

    /* Grab SVG paths */
    const paths = dragon.querySelectorAll<SVGGeometryElement>(
      ".dragon-path, .dragon-wing"
    );
    const eye = dragon.querySelector<SVGCircleElement>(".dragon-eye");

    /* Make paths invisible via dasharray */
    paths.forEach((path) => {
      const len = path.getTotalLength?.() ?? 300;
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
    });
    if (eye) gsap.set(eye, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });

    const tl = gsap.timeline();

    /* 1 — Background radial breathes in */
    if (glow) {
      tl.fromTo(glow,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" },
        0
      );
    }

    /* 2 — Draw body first, then wings, then details */
    const bodyPaths  = dragon.querySelectorAll<SVGGeometryElement>(".dragon-path");
    const wingPaths  = dragon.querySelectorAll<SVGGeometryElement>(".dragon-wing");

    tl.to(bodyPaths, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
      stagger: 0.07,
    }, 0.3);

    tl.to(wingPaths, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: "power2.inOut",
      stagger: 0.06,
    }, 0.8);

    /* 3 — Eye flash */
    if (eye) {
      tl.to(eye, {
        opacity: 1, scale: 1, duration: 0.4,
        ease: "back.out(3)",
      }, 1.6);
      /* Eye pulse */
      tl.to(eye, {
        opacity: 0.6, scale: 0.85,
        duration: 0.6, ease: "power2.inOut",
        repeat: -1, yoyo: true,
      }, 2.2);
    }

    /* 4 — Status text cycles */
    const statuses = [
      "INITIALIZING...",
      "LOADING MODULES...",
      "CONFIGURING NETWORK...",
      "SECURING ENVIRONMENT...",
      "SYSTEM READY",
    ];
    statuses.forEach((s, i) => {
      tl.call(() => {
        if (status) status.textContent = s;
      }, [], 0.5 + i * 0.55);
    });

    /* 5 — Progress bar */
    const progress = { value: 0 };
    tl.to(progress, {
      value: 100,
      duration: 2.4,
      ease: "power1.inOut",
      onUpdate: () => {
        if (bar) bar.style.width = `${progress.value}%`;
        if (pctRef.current)
          pctRef.current.textContent = `${Math.round(progress.value)}%`;
      },
    }, 0.4);

    /* 6 — Exit: fade loading screen, directly enter page */
    tl.to(screen, {
      opacity: 0,
      y: -20,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        setHidden(true);
        document.getElementById("grid-overlay")?.classList.add("visible");
        document.body.classList.add("page-enter");
      },
    }, "+=0.5");

    return () => { tl.kill(); };
  }, []);

  if (hidden) return null;

  return (
    <div ref={screenRef} className="loading-screen kali-loading" aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* ── Layered atmospheric background ── */}
      <div className="kali-bg-layer" />
      <div ref={glowRef} className="kali-bg-radial" />
      <div className="kali-bg-horizon" />
      <div className="kali-bg-vignette" />

      {/* ── Ember particles ── */}
      <div className="kali-particles" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="kali-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── CRT scanlines ── */}
      <div className="kali-scanlines" aria-hidden="true" />

      {/* ── Horizontal sweep line ── */}
      <div className="kali-sweep-line" aria-hidden="true" />

      {/* ── CENTER: Dragon + Branding ── */}
      <div className="kali-center">

        {/* Dragon wrap */}
        <div className="kali-dragon-wrap" ref={dragonRef}>
          <div className="kali-dragon-aura" />
          <KaliDragon />
        </div>

        {/* KALI LINUX wordmark */}
        <div className="kali-brand">
          <span className="kali-brand-kali">KALI</span>
          <span className="kali-brand-sep">·</span>
          <span className="kali-brand-linux">LINUX</span>
        </div>

        {/* Thin divider */}
        <div className="kali-divider" />

        {/* Portfolio sub-label */}
        <p className="kali-sublabel">
          SMS PORTFOLIO <span className="kali-sublabel-ver">v2.2.6</span>
        </p>

        {/* Status line */}
        <div className="kali-status-row">
          <span className="kali-status-dot" />
          <span ref={statusRef} className="kali-status-text">INITIALIZING...</span>
        </div>

        {/* Progress bar */}
        <div className="kali-progress-wrap">
          <div className="kali-progress-track">
            <div ref={progressRef} className="kali-progress-fill" />
            <div className="kali-progress-shimmer" />
          </div>
          <div className="kali-progress-labels">
            <span className="kali-progress-label">LOADING</span>
            <span ref={pctRef} className="kali-progress-pct">0%</span>
          </div>
        </div>
      </div>

      {/* ── Terminal boot log ── */}
      <div className="kali-terminal" aria-live="polite">
        <div className="kali-terminal-inner">
          {BOOT_LINES.map((line, i) => (
            <div
              key={i}
              className={`kali-boot-line ${visibleLines.includes(i) ? "kali-boot-line--visible" : ""}`}
            >
              <span className="kali-boot-ts">
                {line.text.match(/^\[.*?\]/)?.[0] ?? ""}
              </span>
              <span className={`kali-boot-msg ${i === BOOT_LINES.length - 1 ? "kali-boot-msg--cmd" : ""}`}>
                {line.text.replace(/^\[.*?\]\s?/, "")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Corner brackets ── */}
      <div className="kali-corner kali-corner-tl" />
      <div className="kali-corner kali-corner-tr" />
      <div className="kali-corner kali-corner-bl" />
      <div className="kali-corner kali-corner-br" />

      {/* ── Corner label ── */}
      <div className="kali-label-tl">SECURE BOOT</div>
      <div className="kali-label-tr">v2.2.6</div>
    </div>
  );
}

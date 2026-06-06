"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundManager } from "@/lib/sound";
import { TiltCard } from "@/components/ui/TiltCard";
import {
  Terminal,
  FileCode,
  Globe,
  GitBranch,
  Database,
  Cpu,
  Network,
  Brain,
  Zap,
  BookOpen,
  Users,
  Code2,
  Shield,
  Server,
  Cloud,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    label: "Languages",
    skills: [
      { name: "C Programming", level: 65, icon: Terminal },
      { name: "Java", level: 60, icon: FileCode },
      { name: "Python", level: 45, icon: Terminal },
    ],
  },
  {
    label: "Web Development",
    skills: [
      { name: "HTML / CSS", level: 75, icon: Globe },
      { name: "JavaScript", level: 70, icon: Code2 },
      { name: "React / Next.js", level: 55, icon: Cpu },
    ],
  },
  {
    label: "Security & Data",
    skills: [
      { name: "Cybersecurity", level: 40, icon: Shield },
      { name: "SQL", level: 50, icon: Database },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Git / GitHub", level: 65, icon: GitBranch },
      { name: "Linux", level: 45, icon: Server },
    ],
  },
];

const softSkills = [
  { name: "Problem Solving", icon: Brain },
  { name: "Analytical Thinking", icon: Network },
  { name: "Quick Learner", icon: Zap },
  { name: "Team Collaboration", icon: Users },
  { name: "Research", icon: BookOpen },
];

const timeline = [
  {
    year: "2022",
    event: "Started C Programming",
    detail:
      "Began the coding journey learning memory management, pointers, and algorithmic thinking.",
    icon: Terminal,
    side: "left",
  },
  {
    year: "2023",
    event: "Built First Web Pages",
    detail:
      "Ventured into HTML/CSS, discovering the power of visual communication through code.",
    icon: Globe,
    side: "right",
  },
  {
    year: "2024",
    event: "Cybersecurity Studies & Java",
    detail:
      "Enrolled at the University of Science and Technology Peshawar (UET). Explored network security, encryption, and Java OOP concepts.",
    icon: Shield,
    side: "left",
  },
  {
    year: "2025",
    event: "Full-Stack Development",
    detail:
      "Leveled up with JavaScript, React, MySQL, and building production-quality projects.",
    icon: Database,
    side: "right",
  },
  {
    year: "2026",
    event: "Mastering Next.js & Security",
    detail:
      "Building cinematic UIs, CTF challenges, and advanced security tooling.",
    icon: Cloud,
    side: "left",
  },
];

const skillProofs: Record<string, {
  project?: string;
  projectUrl?: string;
  github?: string;
  cert?: string;
  levelText: string;
  levelColor: string;
}> = {
  "C Programming": {
    project: "Custom Compiler & Memory Modules",
    projectUrl: "#projects",
    github: "https://github.com/mahadshah-cyber/c-projects",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
  "Java": {
    project: "Secure Encryption Suite",
    projectUrl: "#projects",
    github: "https://github.com/mahadshah-cyber/java-encryption",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
  "Python": {
    project: "Network Vulnerability Scanner",
    projectUrl: "#projects",
    github: "https://github.com/mahadshah-cyber/python-sec",
    levelText: "Level 2 - APPRENTICE",
    levelColor: "text-yellow-400 border-yellow-500/20 bg-yellow-950/20",
  },
  "HTML / CSS": {
    project: "SMS Portfolio Website v2",
    projectUrl: "/",
    github: "https://github.com/mahadshah-cyber/portfolio-website",
    levelText: "Level 4 - ELITE",
    levelColor: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
  },
  "JavaScript": {
    project: "Kali-Sec Terminal Dashboard",
    projectUrl: "/terminal",
    github: "https://github.com/mahadshah-cyber/js-dashboard",
    levelText: "Level 4 - ELITE",
    levelColor: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
  },
  "React / Next.js": {
    project: "Production Portfolio App",
    projectUrl: "/",
    github: "https://github.com/mahadshah-cyber/portfolio-website",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
  "Cybersecurity": {
    project: "CTF Writeups & Exploit Labs",
    projectUrl: "/ctf",
    cert: "TryHackMe Jr. Penetration Tester",
    levelText: "Level 2 - APPRENTICE",
    levelColor: "text-yellow-400 border-yellow-500/20 bg-yellow-950/20",
  },
  "SQL": {
    project: "Database Security Auditor",
    projectUrl: "#projects",
    github: "https://github.com/mahadshah-cyber/sql-auditor",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
  "Git / GitHub": {
    project: "Active Repositories Hub",
    projectUrl: "https://github.com/mahadshah-cyber",
    github: "https://github.com/mahadshah-cyber",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
  "Linux": {
    project: "Kali Linux OSINT Node",
    github: "https://github.com/mahadshah-cyber/linux-ops",
    levelText: "Level 3 - OPERATIONAL",
    levelColor: "text-green-400 border-green-500/20 bg-green-950/20",
  },
};

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const softRef = useRef<HTMLDivElement>(null);
  const [activeProof, setActiveProof] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headerRef.current?.children.length) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const line = timelineRef.current?.querySelector(
        ".timeline-center-line",
      ) as HTMLElement;
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const leftCards = timelineRef.current?.querySelectorAll(
        ".timeline-card-left",
      );
      const rightCards = timelineRef.current?.querySelectorAll(
        ".timeline-card-right",
      );
      if (leftCards?.length) {
        gsap.fromTo(
          leftCards,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
      if (rightCards?.length) {
        gsap.fromTo(
          rightCards,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const barItems = barsRef.current?.querySelectorAll(".skill-bar-item");
      if (barItems?.length) {
        gsap.fromTo(
          barItems,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: barsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const fills = barsRef.current?.querySelectorAll(".skill-bar-fill");
      fills?.forEach((bar) => {
        const el = bar as HTMLElement;
        const target = parseInt(el.dataset.width || "0");
        ScrollTrigger.create({
          trigger: barsRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const r1 = Math.floor(target * 0.2 + 5);
            const r2 = Math.floor(target * 0.7 + 10);
            const r3 = Math.floor(target * 0.5);
            const tl = gsap.timeline();
            tl.to(el, { width: `${r1}%`, duration: 0.12, ease: "none" })
              .to(el, { width: `${r2}%`, duration: 0.1, ease: "none" })
              .to(el, { width: `${r3}%`, duration: 0.08, ease: "none" })
              .to(el, {
                width: `${target}%`,
                duration: 0.9,
                ease: "power2.out",
                onComplete: () => soundManager.tick(0),
              });
          },
        });
      });

      const softItems = softRef.current?.querySelectorAll(".soft-skill-item");
      if (softItems?.length) {
        gsap.fromTo(
          softItems,
          { y: 20, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: softRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-28 lg:py-36 overflow-hidden bg-zinc-950/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
            Expertise
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Skills & <span className="text-gradient-cinematic">Timeline</span>
          </h2>
          <div className="section-line" />
        </div>

        {/* ── CINEMATIC TIMELINE ── */}
        <div ref={timelineRef} className="relative mb-24">
          <p className="text-xs text-red-500 uppercase tracking-[0.3em] font-accent text-center mb-12">
            Journey
          </p>

          {/* Center vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <div
              className="timeline-center-line w-full h-full"
              style={{
                background:
                  "linear-gradient(to bottom, #FF2020, #8B0000, #FF2020, #660000)",
                boxShadow: "0 0 8px rgba(255,32,32,0.4)",
              }}
            />
          </div>

          <div className="space-y-8">
            {timeline.map(({ year, event, detail, icon: Icon, side }) => (
              <div key={year} className="relative flex items-center">
                {side === "left" ? (
                  <>
                    <div className="timeline-card-left w-[calc(50%-2rem)] pr-6 flex justify-end">
                      <TiltCard className="max-w-xs w-full" maxTilt={8}>
                      <div className="w-full rounded-2xl glass-card p-5 border-l-4 border-red-600/60 hover:border-red-500 transition-colors duration-300 group interactive">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-[10px] font-accent text-red-400 tracking-widest">
                            {year}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                          {event}
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {detail}
                        </p>
                      </div>
                      </TiltCard>
                    </div>

                    <div className="relative z-10 shrink-0 w-16 flex items-center justify-center">
                      <div className="relative w-4 h-4 rounded-full bg-red-600 border-2 border-black shadow-[0_0_12px_rgba(255,32,32,0.7)]">
                        <div
                          className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                      </div>
                    </div>

                    <div className="w-[calc(50%-2rem)]" />
                  </>
                ) : (
                  <>
                    <div className="w-[calc(50%-2rem)]" />

                    <div className="relative z-10 shrink-0 w-16 flex items-center justify-center">
                      <div className="relative w-4 h-4 rounded-full bg-red-600 border-2 border-black shadow-[0_0_12px_rgba(255,32,32,0.7)]">
                        <div
                          className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"
                          style={{ animationDuration: "2.5s" }}
                        />
                      </div>
                    </div>

                    <div className="timeline-card-right w-[calc(50%-2rem)] pl-6">
                      <TiltCard className="max-w-xs w-full" maxTilt={8}>
                      <div className="w-full rounded-2xl glass-card p-5 border-l-4 border-red-600/60 hover:border-red-500 transition-colors duration-300 group interactive">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-[10px] font-accent text-red-400 tracking-widest">
                            {year}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                          {event}
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {detail}
                        </p>
                      </div>
                      </TiltCard>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SKILL BARS ── */}
        <div ref={barsRef} className="mb-16">
          <p className="text-xs text-red-500 uppercase tracking-[0.3em] font-accent text-center mb-12">
            Technical Skills
          </p>

          <div className="grid lg:grid-cols-2 gap-x-16 gap-y-2">
            {skillGroups.map(({ label, skills }) => (
              <div key={label} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-red-500 uppercase tracking-[0.25em] font-accent">
                    {label}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-red-900/50 to-transparent" />
                </div>

                <div className="space-y-4">
                  {skills.map(({ name, level, icon: Icon }) => (
                    <div key={name} className="skill-bar-item p-3.5 rounded-xl border border-zinc-900/60 bg-zinc-950/10 hover:border-zinc-800/80 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-red-500/70" />
                          <span className="text-xs text-zinc-400 font-mono">
                            {name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-600 font-mono">
                            {level}%
                          </span>
                          <button
                            onClick={() => {
                              setActiveProof(activeProof === name ? null : name);
                              soundManager.click();
                            }}
                            className="text-[9px] font-mono text-red-500/70 hover:text-red-400 transition-colors uppercase border border-red-900/40 rounded px-1.5 py-0.5 bg-red-950/10 cursor-pointer select-none"
                          >
                            {activeProof === name ? "Close" : "Verify"}
                          </button>
                        </div>
                      </div>

                      <div
                        className="relative w-full h-[5px] bg-zinc-900 rounded-full overflow-hidden"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 8px)",
                        }}
                      >
                        <div
                          className="skill-bar-fill h-full rounded-full relative overflow-hidden"
                          data-width={level}
                          style={{
                            width: "0%",
                            background:
                              "linear-gradient(90deg, #3d0000, #8B0000, #FF4444)",
                            boxShadow: "2px 0 8px rgba(255,32,32,0.6)",
                          }}
                        >
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/60 rounded-full" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        </div>
                      </div>

                      {/* Expandable Evidence/Proof Panel */}
                      {activeProof === name && (
                        <div className="mt-3 pt-3 border-t border-zinc-900 font-mono text-[10px] space-y-2 text-left animate-fade-in-up">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Threat level:</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${skillProofs[name]?.levelColor || "text-zinc-400"}`}>
                              {skillProofs[name]?.levelText || "Level 2 - APPRENTICE"}
                            </span>
                          </div>

                          {skillProofs[name]?.project && (
                            <div className="flex items-start justify-between gap-4">
                              <span className="text-zinc-500">Proof project:</span>
                              {skillProofs[name]?.projectUrl ? (
                                <a
                                  href={skillProofs[name]?.projectUrl}
                                  className="text-red-400 hover:text-red-300 hover:underline text-right"
                                >
                                  {skillProofs[name]?.project} →
                                </a>
                              ) : (
                                <span className="text-zinc-300 text-right">{skillProofs[name]?.project}</span>
                              )}
                            </div>
                          )}

                          {skillProofs[name]?.github && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">Repository:</span>
                              <a
                                href={skillProofs[name]?.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1"
                              >
                                github.com
                              </a>
                            </div>
                          )}

                          {skillProofs[name]?.cert && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">Credential:</span>
                              <span className="text-zinc-300">{skillProofs[name]?.cert}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SOFT SKILLS ── */}
        <div ref={softRef} className="text-center">
          <p className="text-xs text-red-500 uppercase tracking-[0.3em] font-accent mb-8">
            Soft Skills
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {softSkills.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="soft-skill-item interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm text-zinc-400 hover:text-white hover:border-red-900/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,32,32,0.1)]"
                onMouseEnter={(e) => {
                  const pan = (e.clientX / window.innerWidth - 0.5) * 2;
                  soundManager.hover(pan);
                }}
              >
                <Icon className="w-3.5 h-3.5 text-red-500" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

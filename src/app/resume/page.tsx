"use client";

import { useState } from "react";
import Link from "next/link";
import { soundManager } from "@/lib/sound";
import {
  ArrowLeft,
  Award,
  Briefcase,
  GraduationCap,
  Shield,
  Printer,
} from "lucide-react";

const TIMELINE_NODES = [
  {
    id: "node-5",
    type: "education",
    title: "Cybersecurity & Software Engineering studies",
    institution: "UET Peshawar",
    duration: "2024 - Present",
    desc: "Enrolled in specialized undergraduate computer science and cybersecurity classes. Actively investigating cryptography architectures, networks, and memory safety.",
    skills: [
      "Networking",
      "Network Security",
      "Cryptography",
      "Academic Excellence",
    ],
  },
  {
    id: "node-4",
    type: "experience",
    title: "Full-Stack Web Architect (Freelance)",
    institution: "Digital Surface Nodes",
    duration: "2023 - Present",
    desc: "Designing secure, high-speed single page and full-stack web applications. Deploying low-latency server APIs, managing relational databases, and configuring secure user authorizations.",
    skills: ["React", "Next.js", "MySQL", "Prisma ORM", "TypeScript"],
  },
  {
    id: "node-3",
    type: "education",
    title: "Higher Secondary Computer Science studies",
    institution: "Board of Intermediate & Secondary Education",
    duration: "2022 - 2024",
    desc: "Completed intermediate secondary sciences with a focus on computer science structures, hardware, and mathematics. Concluded with a high-standing score of 86.25%.",
    skills: ["C Programming", "Discrete Mathematics", "Data Structures"],
  },
  {
    id: "node-2",
    type: "experience",
    title: "Software Engineering & Java developer",
    institution: "Open Source Communities",
    duration: "2022 - 2023",
    desc: "Delved into Object-Oriented Programming (OOP) architectures using Java. Built desktop toolings, multi-threaded applications, and automated file encryption handlers.",
    skills: ["Java Core", "JavaFX", "Algorithmic Logic"],
  },
  {
    id: "node-1",
    type: "education",
    title: "First Lines of Code: The C Initiation",
    institution: "Self-Instruction Node",
    duration: "2022",
    desc: "Began coding journey in procedural computer architectures learning pointers, manual memory allocation, and foundational data structures.",
    skills: ["C Programming", "Binary Mathematics", "Pointers"],
  },
];

const SKILL_SECTORS = [
  {
    label: "Languages",
    skills: [
      "C Programming",
      "Java Core",
      "Python Script",
      "JavaScript",
      "TypeScript",
      "SQL",
    ],
  },
  {
    label: "Web Frameworks",
    skills: [
      "HTML5 / CSS3",
      "React",
      "Next.js (App Router)",
      "Node.js",
      "Express",
      "Tailwind CSS v4",
    ],
  },
  {
    label: "Security & Database",
    skills: [
      "Cybersecurity Core",
      "OWASP Web Scan",
      "Nmap Port Audit",
      "MySQL",
      "Prisma ORM",
      "Git / GitHub",
    ],
  },
  {
    label: "Core Soft Skills",
    skills: [
      "Problem Solving",
      "Analytical Thinking",
      "Research Engine",
      "Team Collaboration",
      "Quick Learner",
    ],
  },
];

const CERTIFICATIONS = [
  {
    name: "Cybersecurity Fundamentals",
    issuer: "Lab Node Studies",
    hash: "VERIFIED_HASH_8F3A",
  },
  {
    name: "Full-Stack Software Architecture",
    issuer: "Dev Node Inc.",
    hash: "VERIFIED_HASH_9A2D",
  },
  {
    name: "C & Java Algorithms",
    issuer: "Code Academic",
    hash: "VERIFIED_HASH_4C1B",
  },
];

const CONTACT = {
  email: "mahadshahcr450@gmail.com",
  location: "KPK, Pakistan",
  github: "github.com/mahadshah-cyber",
  linkedin: "linkedin.com/in/mahad-shah-2901443b1",
};

export default function ResumePage() {
  const [activeNode, setActiveNode] = useState(TIMELINE_NODES[0]);
  const [filterTech, setFilterTech] = useState<string | null>(null);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.click();

    document.body.classList.add("is-printing");

    const cleanup = () => {
      document.body.classList.remove("is-printing");
    };

    window.addEventListener("afterprint", cleanup, { once: true });
    setTimeout(cleanup, 3000);

    // Brief delay so the browser applies print styles before the dialog opens
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const selectNode = (node: (typeof TIMELINE_NODES)[number]) => {
    soundManager.click();
    setActiveNode(node);
  };

  const toggleSkillFilter = (skill: string) => {
    soundManager.hover();
    setFilterTech(filterTech === skill ? null : skill);
  };

  return (
    <>
      {/* Print-only CV — clean layout for PDF / paper */}
      <div className="print-cv" aria-hidden="true">
        <header className="mb-6 border-b border-black pb-4">
          <h1>Syed Mahad Shah</h1>
          <p className="font-semibold mt-1">
            Cybersecurity Enthusiast & Full-Stack Engineer
          </p>
          <p className="mt-2">
            {CONTACT.email} · {CONTACT.location}
          </p>
          <p>
            {CONTACT.github} · {CONTACT.linkedin}
          </p>
        </header>

        <section>
          <h2>Professional Summary</h2>
          <p>
            Dedicated student at UET Peshawar pursuing cybersecurity and
            full-stack development. Experienced in building secure web
            applications with React, Next.js, and MySQL. Passionate about
            digital defense, CTF challenges, and continuous learning.
          </p>
        </section>

        <section>
          <h2>Experience & Education</h2>
          {TIMELINE_NODES.map((node) => (
            <div key={node.id} className="mb-4">
              <p className="font-semibold">{node.title}</p>
              <p>
                {node.institution} · {node.duration}
              </p>
              <p className="mt-1">{node.desc}</p>
              <p className="mt-1">
                <strong>Skills:</strong> {node.skills.join(", ")}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2>Technical Skills</h2>
          {SKILL_SECTORS.map((sector) => (
            <div key={sector.label} className="mb-3">
              <p className="font-semibold">{sector.label}</p>
              <p>{sector.skills.join(" · ")}</p>
            </div>
          ))}
        </section>

        <section>
          <h2>Certifications</h2>
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.name} className="mb-2">
              <p className="font-semibold">{cert.name}</p>
              <p>
                {cert.issuer} — {cert.hash}
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* Interactive screen view */}
      <div className="screen-only min-h-screen bg-black text-zinc-300 py-28 lg:py-36 relative selection:bg-red-500/40 selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.04),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-red-500/2 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 z-10 relative">
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors"
              onClick={() => soundManager.click()}
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/50 transition-all text-xs font-mono"
            >
              <Printer className="w-3.5 h-3.5" />
              PRINT CV / SAVE PDF
            </button>
          </div>

          <div className="mb-14 text-center lg:text-left">
            <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
              System Intel
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Syed <span className="text-gradient-cinematic">Mahad Shah</span>
            </h1>
            <p className="text-sm font-mono tracking-widest text-zinc-500 uppercase mt-2">
              Cybersecurity Enthusiast & Full-Stack Engineer
            </p>
            <div className="w-20 h-[2px] bg-gradient-to-r from-red-600 to-transparent mt-4" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white font-accent">
                  Career Node Tree
                </h2>
                <span className="text-[10px] text-zinc-600 font-mono tracking-widest ml-auto">
                  CLICK NODES TO EXPAND SUMMARY
                </span>
              </div>

              <div className="relative pl-8 border-l border-zinc-800/80 ml-4">
                {TIMELINE_NODES.map((node) => {
                  const isSelected = activeNode.id === node.id;
                  const Icon =
                    node.type === "education" ? GraduationCap : Briefcase;

                  return (
                    <div key={node.id} className="mb-10 last:mb-0 relative group">
                      <button
                        onClick={() => selectNode(node)}
                        className={`absolute -left-[41px] w-[24px] h-[24px] rounded-full border-2 bg-black flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? "border-red-500 shadow-[0_0_12px_rgba(255,32,32,0.6)]"
                            : "border-zinc-800 hover:border-zinc-500"
                        }`}
                      >
                        <Icon
                          className={`w-3 h-3 ${isSelected ? "text-red-500 animate-pulse" : "text-zinc-600"}`}
                        />
                      </button>

                      <div
                        onClick={() => selectNode(node)}
                        className={`rounded-2xl p-5 border transition-all duration-500 cursor-pointer ${
                          isSelected
                            ? "glass-card border-red-900/35 shadow-[0_0_20px_rgba(255,32,32,0.06)] scale-[1.01]"
                            : "bg-zinc-950/20 border-zinc-900 hover:border-zinc-800"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3
                            className={`text-sm font-bold transition-colors ${isSelected ? "text-red-400" : "text-white"}`}
                          >
                            {node.title}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-500 tracking-wider bg-zinc-900/50 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                            {node.duration}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-medium mb-3">
                          {node.institution}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {node.skills.map((s) => (
                            <span
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSkillFilter(s);
                              }}
                              className={`px-2 py-0.5 text-[9px] rounded font-mono transition-all cursor-pointer ${
                                filterTech === s
                                  ? "bg-red-600 text-white border-red-500"
                                  : "bg-zinc-900/70 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl glass-card border-red-950/30 p-6 shadow-[0_0_25px_rgba(255,32,32,0.03)]">
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800/50 pb-3">
                  <Shield className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-accent">
                    Active Node Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {activeNode.title}
                    </h4>
                    <p className="text-[10px] text-red-500 font-mono mt-1">
                      {activeNode.institution}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {activeNode.desc}
                  </p>

                  <div className="border-t border-zinc-800/40 pt-4">
                    <span className="text-[10px] font-accent text-zinc-500 uppercase tracking-widest block mb-2">
                      Core Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeNode.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-[10px] bg-red-950/10 border border-red-900/20 text-red-400 rounded font-mono uppercase tracking-wider"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white font-accent">
                    Skill Sectors
                  </h2>
                </div>

                <div className="space-y-5">
                  {SKILL_SECTORS.map((sector) => (
                    <div
                      key={sector.label}
                      className="rounded-xl bg-zinc-950/20 border border-zinc-900 p-4 hover:border-zinc-800 transition-colors"
                    >
                      <span className="text-[10px] text-red-500 uppercase font-accent tracking-widest block mb-3">
                        {sector.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sector.skills.map((skill) => {
                          const isFiltered = filterTech === skill;
                          return (
                            <button
                              key={skill}
                              onClick={() => toggleSkillFilter(skill)}
                              className={`px-2.5 py-1 rounded text-xs transition-all duration-300 font-mono tracking-wide ${
                                isFiltered
                                  ? "bg-red-600 text-white font-semibold shadow-md shadow-red-500/10 scale-105"
                                  : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                              }`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white font-accent">
                    Verified Certifications
                  </h2>
                </div>
                <div className="space-y-3">
                  {CERTIFICATIONS.map((cert) => (
                    <div
                      key={cert.name}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:border-red-950/30 transition-all group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                          {cert.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">
                          {cert.issuer}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-green-500 px-2 py-0.5 rounded bg-green-950/10 border border-green-900/20">
                        {cert.hash}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

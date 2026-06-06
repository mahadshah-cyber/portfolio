"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Shield, Code, Globe, Lock } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { soundManager } from "@/lib/sound";

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: "Google Cybersecurity Professional",
    issuer: "Google / Coursera",
    date: "In Progress",
    icon: Shield,
    color: "#4285F4",
    description: "Foundations of cybersecurity, network security, incident response, and security operations.",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    date: "2025",
    icon: Lock,
    color: "#1BA0D7",
    description: "Core security concepts, threat landscape, cryptography fundamentals, and security best practices.",
  },
  {
    title: "Programming in C",
    issuer: "Sololearn / University Coursework",
    date: "2023",
    icon: Code,
    color: "#555555",
    description: "Structured programming, memory management, data structures, and algorithm design in C.",
  },
  {
    title: "Web Development Fundamentals",
    issuer: "Self-Paced / Online",
    date: "2023",
    icon: Globe,
    color: "#E34F26",
    description: "HTML5, CSS3, responsive design, JavaScript ES6+, and modern web standards.",
  },
  {
    title: "Java Programming",
    issuer: "University Coursework",
    date: "2024",
    icon: Code,
    color: "#ED8B00",
    description: "Object-oriented programming, Java collections, multithreading, and GUI development.",
  },
  {
    title: "SQL & Database Design",
    issuer: "Self-Paced / Online",
    date: "2024",
    icon: Award,
    color: "#4479A1",
    description: "Relational database design, complex queries, normalization, and MySQL administration.",
  },
];

export function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const headerEl = headerRef.current;
      if (headerEl && headerEl.children.length > 0) {
        gsap.fromTo(
          headerEl.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
              trigger: headerEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const gridEl = gridRef.current;
      if (gridEl) {
        const cards = gridEl.querySelectorAll(".cert-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 60, opacity: 0, rotateX: 5 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gridEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative py-28 lg:py-36 overflow-hidden bg-black"
    >
      {/* Decorative */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,0,0,0.04),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-500/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
            Credentials
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Certifications & <span className="text-gradient-cinematic">Courses</span>
          </h2>
          <div className="section-line" />
          <p className="text-zinc-600 mt-4 max-w-lg mx-auto text-sm">
            Continuous learning in cybersecurity, programming, and web technologies.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {certifications.map((cert) => {
            const Icon = cert.icon;
            return (
              <TiltCard key={cert.title} className="cert-card" maxTilt={10}>
              <div
                className="group relative rounded-2xl glass-card p-6 overflow-hidden transition-all duration-500 hover:border-red-900/40 hover:shadow-[0_0_30px_rgba(255,32,32,0.06)] interactive"
                onClick={() => soundManager.click()}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                  style={{ background: cert.color }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${cert.color}15`,
                    border: `1px solid ${cert.color}30`,
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: cert.color }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-gradient-cinematic transition-all duration-300">
                  {cert.title}
                </h3>

                {/* Issuer + Date */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-zinc-500 font-medium">{cert.issuer}</span>
                  <span className="text-[10px] text-zinc-700 font-mono">•</span>
                  <span className="text-[10px] text-red-500/70 font-mono uppercase tracking-wider">{cert.date}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                  {cert.description}
                </p>

                {/* Hover glow */}
                <div
                  className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${cert.color}20 0%, transparent 70%)`,
                  }}
                />
              </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

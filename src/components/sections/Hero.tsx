"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Typewriter } from "@/components/ui/Typewriter";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { ArrowRight } from "lucide-react";

const HeroCanvas = dynamic(
  () => import("@/components/3d/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

const HERO_INTRO_KEY = "hero-intro-done";

const HERO_STATS = [
  { value: "5+", label: "Projects" },
  { value: "86%", label: "Academic" },
  { value: "2+", label: "Years Code" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const total = sectionRef.current.clientHeight;
    const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight));
    const progress = 1 - visible / total;
    setScrollProgress(Math.max(0, Math.min(progress, 1)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const hasIntroPlayed =
      typeof window !== "undefined" &&
      sessionStorage.getItem(HERO_INTRO_KEY) === "1";

    const ctx = gsap.context(() => {
      gsap.set(
        [titleRef.current, taglineRef.current, ctaRef.current, statsRef.current],
        { clearProps: "all" },
      );

      if (scanLineRef.current && !hasIntroPlayed) {
        scanLineRef.current.style.display = "block";
        gsap.fromTo(
          scanLineRef.current,
          { top: "-10%" },
          {
            top: "110%",
            duration: 1.8,
            ease: "expo.inOut",
            delay: 0.3,
            onComplete: () => {
              if (scanLineRef.current) {
                scanLineRef.current.style.display = "none";
              }
            },
          },
        );
      }

      const blocks = panelRef.current?.querySelectorAll(".hero-animate");
      if (blocks?.length) {
        if (hasIntroPlayed) {
          gsap.set(blocks, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            blocks,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power3.out",
              delay: 0.4,
              onComplete: () => {
                sessionStorage.setItem(HERO_INTRO_KEY, "1");
              },
            },
          );
        }
      }

      if (titleRef.current) {
        gsap.set(titleRef.current, { scale: 1, opacity: 1 });
        gsap.to(titleRef.current, {
          scale: 0.75,
          opacity: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      const fadeOnScroll = [taglineRef.current, ctaRef.current, statsRef.current];
      fadeOnScroll.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 1 });
        gsap.to(el, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "15% top",
            end: "45% top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      const indicator = sectionRef.current?.querySelector(".scroll-indicator");
      if (indicator) {
        gsap.set(indicator, { opacity: 1 });
        gsap.to(indicator, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "40% top",
            end: "70% top",
            scrub: true,
          },
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section relative overflow-hidden bg-black"
    >
      <div
        className="corner-accent corner-accent-tl"
        style={{ zIndex: 30, top: "80px", left: "0" }}
      />
      <div
        className="corner-accent corner-accent-tr"
        style={{ zIndex: 30, top: "80px", right: "0" }}
      />

      <HeroCanvas scrollProgress={scrollProgress} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at top right, rgba(139,0,0,0.15) 0%, transparent 50%)",
        }}
      />

      <div
        ref={scanLineRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, display: "none" }}
      >
        <div className="w-full h-px bg-gradient-to-b from-transparent via-red-500/60 to-transparent" />
      </div>

      <div className="scan-sweep" style={{ zIndex: 2 }} />

      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          zIndex: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(255,32,32,0.4), transparent)",
        }}
      />

      <div className="hero-grid max-w-7xl mx-auto">
        <span className="hero-index">SECURE · PORTFOLIO · 2026</span>

        <div ref={panelRef} className="hero-panel">
          <div className="hero-status hero-animate">
            <span className="hero-status-dot" />
            <span>SYSTEM: ONLINE</span>
          </div>

          <div className="hero-eyebrow hero-animate">
            <span className="w-1 h-1 rounded-full bg-red-500" />
            Cybersecurity Enthusiast & Developer
          </div>

          <h1 ref={titleRef} className="hero-title hero-animate">
            <span className="hero-title-sub">Portfolio of</span>
            Hi, I&apos;m{" "}
            <span className="text-gradient-cinematic">Mahad</span>{" "}
            <span className="text-gradient-cinematic">Shah</span>
          </h1>

          <div className="hero-typewriter-slot hero-animate">
            <div className="hero-typewriter-box">
              <span className="hero-typewriter-prefix">&gt;_</span>
              <Typewriter
                texts={[
                  "Cybersecurity Student",
                  "Full-Stack Developer",
                  "CTF Enthusiast",
                  "Digital Defender",
                ]}
                speed={70}
                deleteSpeed={40}
                pauseDuration={3000}
              />
            </div>
          </div>

          <p ref={taglineRef} className="hero-tagline hero-animate">
            <span className="hero-tagline-accent">
              Aspiring cybersecurity expert
            </span>{" "}
            — dedicated to securing digital systems through code, research, and
            relentless innovation.
          </p>

          <div ref={ctaRef} className="hero-cta-row hero-animate">
            <Link href="#projects" className="hero-btn-primary group">
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="#contact" className="hero-btn-ghost">
              Contact Me
            </Link>
          </div>

          <div ref={statsRef} className="hero-stats hero-animate">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="hero-stat-value">{value}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="hero-animate mt-6 max-w-xs">
            <ActivityFeed />
          </div>
        </div>
      </div>

      <div
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-700"
        style={{ zIndex: 10 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-700 to-transparent">
          <div className="w-px h-3 bg-red-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  Code,
  Shield,
  Award,
  MapPin,
  Languages,
  Target,
  GraduationCap,
} from "lucide-react";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { EdgeGlowCard } from "@/components/ui/EdgeGlowCard";
import { Magnetic } from "@/components/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  "> whoami",
  "Syed Mahad Shah",
  "> cat skills.txt",
  "Cybersecurity | Web Dev | Problem Solver",
  "> location",
  "KPK, Pakistan",
  "> status",
  "Available for opportunities ●",
];

const IMAGES = [
  { src: "/images/profile.png", alt: "Syed Mahad Shah — Profile" },
  { src: "/images/pic.png", alt: "Syed Mahad Shah — Photo" },
];

function ImageFlipper() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const flip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % IMAGES.length);
        setFading(false);
      }, 280);
    },
    [fading],
  );

  const current = IMAGES[index];
  const nextIndex = (index + 1) % IMAGES.length;

  return (
    <div className="bento-card lg:row-span-2 lg:col-span-1 rounded-2xl glass-card overflow-hidden group relative">
      <div className="relative w-full h-full min-h-[300px] lg:min-h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="relative w-full h-full hologram-glitch"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {/* Current image */}
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-110"
              style={{
                opacity: fading ? 0 : 1,
                transition: fading
                  ? "opacity 0.28s ease"
                  : "opacity 0.28s ease, transform 0.7s ease",
              }}
              priority
            />
            {/* Preload next */}
            <Image
              src={IMAGES[nextIndex].src}
              alt={IMAGES[nextIndex].alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              style={{ opacity: 0, position: "absolute", inset: 0 }}
            />
            <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay group-hover:animate-pulse" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Status badge */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-red-900/30 text-[10px] text-zinc-400 font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          STATUS: AVAILABLE
        </div>
      </div>

      {/* Flip arrow */}
      <button
        onClick={flip}
        aria-label="Flip to next photo"
        title="Flip photo"
        className="img-flip-btn"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2 3 L5 1 L8 3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 7 L5 9 L8 7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="5"
            y1="1"
            x2="5"
            y2="9"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        <span
          className="img-flip-dot"
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      </button>
    </div>
  );
}

const stats = [
  { icon: Code, label: "Projects Built", value: "5+" },
  { icon: Shield, label: "Security Learning", value: "2+" },
  { icon: Award, label: "Academic Score", value: "86%" },
];

const infoCards = [
  { icon: MapPin, label: "From", value: "KPK, Pakistan" },
  { icon: Languages, label: "Languages", value: "Pashto, Urdu, English" },
  { icon: Target, label: "Goal", value: "Cybersecurity Expert" },
  { icon: GraduationCap, label: "University", value: "UET Peshawar" },
];

function TerminalCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const doneTypingRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => setStarted(true),
        once: true,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!started) return;

    let lineIndex = 0;
    let charIndex = 0;
    const currentLines: string[] = [];
    let timeoutId: ReturnType<typeof setTimeout>;
    let stopped = false;

    function typeNextChar() {
      if (stopped) return;

      if (lineIndex >= TERMINAL_LINES.length) {
        doneTypingRef.current = true;
        return;
      }

      const currentLine = TERMINAL_LINES[lineIndex];

      if (charIndex <= currentLine.length) {
        currentLines[lineIndex] = currentLine.slice(0, charIndex);
        setLines([...currentLines]);
        charIndex++;
        // ── Sound removed from terminal typing ──
        timeoutId = setTimeout(typeNextChar, 25 + Math.random() * 15);
      } else {
        currentLines[lineIndex] = currentLine;
        setLines([...currentLines]);
        lineIndex++;
        charIndex = 0;
        const pause = currentLine.startsWith(">") ? 150 : 350;
        timeoutId = setTimeout(typeNextChar, pause);
      }
    }

    timeoutId = setTimeout(typeNextChar, 600);

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <EdgeGlowCard
      className="bento-card lg:col-span-2"
      beadColor="#ff2020"
      duration="5s"
    >
      <div
        ref={cardRef}
        className="w-full h-full bg-black/90 backdrop-blur-sm flex flex-col"
      >
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800/50">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-[10px] text-zinc-600 font-mono tracking-wider">
            terminal — bash — 80×24
          </span>
        </div>

        <div className="p-5 lg:p-6 font-mono text-xs leading-[1.8] min-h-[220px]">
          {lines.map((line, i) => (
            <div key={i}>
              {line.startsWith("> ") ? (
                <div>
                  <span className="text-green-400 select-none">{"$ "}</span>
                  <span className="text-zinc-200">{line.slice(2)}</span>
                </div>
              ) : line === ">" ? (
                <div>
                  <span className="text-green-400 select-none">{"$ "}</span>
                </div>
              ) : (
                <div className="text-zinc-500 pl-3">{line}</div>
              )}
            </div>
          ))}
          <span
            className="inline-block w-2 h-3.5 bg-green-400 align-middle ml-0.5"
            style={{
              opacity: cursorVisible ? 0.9 : 0,
              transition: "opacity 0.1s",
              display: started ? "inline-block" : "none",
            }}
          />
        </div>
      </div>
    </EdgeGlowCard>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const headerEl = headerRef.current;
      if (headerEl && headerEl.children.length > 0) {
        gsap.fromTo(
          headerEl.children,
          { y: 40, opacity: 0 },
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
          },
        );
      }

      const bentoEl = bentoRef.current;
      if (bentoEl) {
        const cards = bentoEl.querySelectorAll(".bento-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bentoEl,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }

      const statsEl = statsRef.current;
      if (statsEl) {
        gsap.fromTo(
          statsEl,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: statsEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        const statEls = statsEl.querySelectorAll(".stat-value");
        statEls.forEach((el) => {
          const text = el.textContent || "";
          const num = parseFloat(text);
          if (isNaN(num)) return;
          const suffix = text.replace(/[\d.]/g, "");
          gsap.fromTo(
            el,
            { textContent: "0" + suffix },
            {
              duration: 2.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
              onUpdate: function () {
                const progress = this.progress();
                const current = Math.round(num * progress);
                (el as HTMLElement).textContent = current + suffix;
              },
            },
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 lg:py-36 overflow-hidden bg-black"
    >
      {/* Corner accents */}
      <div
        className="corner-accent corner-accent-tl"
        style={{ zIndex: 3, top: "0", left: "0" }}
      />
      <div
        className="corner-accent corner-accent-tr"
        style={{ zIndex: 3, top: "0", right: "0" }}
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,0,0,0.06),transparent_60%)] pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/3 rounded-full blur-[120px] pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Section divider accent */}
      <div
        className="absolute top-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent pointer-events-none"
        style={{ zIndex: 3 }}
      />

      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ zIndex: 2 }}
      >
        <div ref={headerRef} className="text-center mb-20">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-accent mb-3">
            About
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Who is <span className="text-gradient-cinematic">Mahad Shah</span>?
          </h2>
          <div className="section-line" />
        </div>

        <div
          ref={bentoRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          <ImageFlipper />

          <EdgeGlowCard
            className="bento-card lg:col-span-2"
            beadColor="#ff2020"
            duration="6s"
            beadLength={22}
          >
            <div className="w-full h-full p-6 lg:p-10">
              <div className="space-y-6 text-zinc-400 leading-relaxed">
                <ScrollRevealText
                  text="A dedicated student at the University of Science and Technology Peshawar (UET), pursuing a mission to master Cybersecurity and software development. Currently excelling in Computer Science with a strong focus on digital defense."
                  as="p"
                  className="text-base sm:text-lg font-light"
                />
                <ScrollRevealText
                  text="My journey into technology started with curiosity about how digital systems work and evolved into a mission to protect them. I have hands-on experience with C, Java, web development, and a growing expertise in cybersecurity fundamentals."
                  as="p"
                  className="text-base sm:text-lg font-light"
                />
                <ScrollRevealText
                  text="Every project I build is a step toward my goal of becoming a world-class Cybersecurity expert, protecting digital systems globally."
                  as="p"
                  className="text-base sm:text-lg font-light"
                />
              </div>
              <div className="mt-8 pt-6 border-t border-zinc-800/30">
                <blockquote className="text-sm italic text-zinc-500 font-mono tracking-wide">
                  &ldquo;The only secure system is the one that is constantly
                  evolving.&rdquo;
                </blockquote>
              </div>
            </div>
          </EdgeGlowCard>

          <TerminalCard />

          {infoCards.map(({ icon: Icon, label, value }) => (
            <Magnetic key={label} strength={0.15}>
              <div
                className="bento-card rounded-xl glass-card p-5 flex items-center gap-4 group hover:border-red-600/30 transition-all duration-500"
                // ── Sound removed from info card hover ──
              >
                <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/20 flex items-center justify-center shrink-0 group-hover:bg-red-950/40 transition-colors">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-accent">
                    {label}
                  </span>
                  <p className="text-sm text-zinc-300 mt-0.5 font-medium">
                    {value}
                  </p>
                </div>
              </div>
            </Magnetic>
          ))}
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-4 lg:gap-6 mt-12 max-w-3xl mx-auto"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="text-center p-8 rounded-xl glass-card hover:border-red-500/20 transition-all duration-700 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-6 h-6 text-red-500 mx-auto mb-3 group-hover:scale-125 transition-transform duration-500" />
              <div className="stat-value text-2xl lg:text-4xl font-bold text-white tracking-tighter">
                {value}
              </div>
              <div className="text-[10px] text-zinc-600 mt-2 uppercase tracking-[0.2em] font-accent">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

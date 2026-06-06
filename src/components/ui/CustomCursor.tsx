"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!root || !dot || !ring || !glow) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) return;

    const moveTo = (x: number, y: number) => {
      gsap.to(dot, { x, y, duration: 0.12, ease: "power3.out" });
      gsap.to(ring, { x, y, duration: 0.35, ease: "power2.out" });
      gsap.to(glow, { x, y, duration: 0.55, ease: "power2.out" });
    };

    const onMove = (e: MouseEvent) => {
      // Activate cursor on first mouse movement — works on every page
      if (!root.classList.contains("is-active")) {
        document.body.classList.add("custom-cursor-active");
        root.classList.add("is-active");
      }
      moveTo(e.clientX, e.clientY);
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.15 });
      gsap.to(dot, { scale: 1.4, duration: 0.15 });
      gsap.to(glow, { scale: 1.3, opacity: 0.9, duration: 0.15 });
    };

    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: "elastic.out(1, 0.5)" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(glow, { scale: 1, opacity: 0.5, duration: 0.25 });
    };

    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], .interactive, input, textarea, select, label",
      );

      if (interactive) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "#ff4444",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(dot, {
          scale: 0.6,
          backgroundColor: "#ffffff",
          duration: 0.3,
        });
        gsap.to(glow, { scale: 2.2, opacity: 0.75, duration: 0.3 });
      } else {
        gsap.to(ring, { scale: 1, borderColor: "#ff2020", duration: 0.3 });
        gsap.to(dot, { scale: 1, backgroundColor: "#ff2020", duration: 0.3 });
        gsap.to(glow, { scale: 1, opacity: 0.5, duration: 0.3 });
      }
    };

    const onLeave = () => {
      gsap.to([dot, ring, glow], { opacity: 0, duration: 0.2 });
    };

    const onEnter = () => {
      gsap.to([dot, ring, glow], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onHover);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      root.classList.remove("is-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onHover);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="custom-cursor-root screen-only"
      aria-hidden="true"
    >
      <div ref={glowRef} className="cursor-glow" />
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-orbit" />
        <span className="cursor-ring-orbit cursor-ring-orbit--delay" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

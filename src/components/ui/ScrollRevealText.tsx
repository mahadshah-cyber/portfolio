"use client";

import { useRef, useEffect, useMemo } from "react";
import { soundManager } from "@/lib/sound";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "div";
  playSound?: boolean;
}

/**
 * ScrollRevealText — v2.0 Performance Rewrite
 * 
 * Uses IntersectionObserver + requestAnimationFrame for efficient scroll-based
 * word reveal. Instead of calculating positions on every scroll event (the old way),
 * this uses a single observer that batches updates via rAF.
 */
export function ScrollRevealText({
  text,
  className = "",
  as: Tag = "p",
  playSound = true,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const rafIdRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || words.length === 0) return;

    const wordSpans = el.querySelectorAll<HTMLSpanElement>(".reveal-word");
    wordsRef.current = Array.from(wordSpans);
    if (wordsRef.current.length === 0) return;

    const triggerLine = 0.55; // 55% viewport line

    function updateWords() {
      const triggerY = window.innerHeight * triggerLine;

      wordsRef.current.forEach((word, index) => {
        const rect = word.getBoundingClientRect();
        const wordCenter = rect.top + rect.height / 2;
        const isRevealed = wordCenter < triggerY;

        if (isRevealed) {
          const wasPlayed = word.dataset.played === "true";
          if (!wasPlayed) {
            word.dataset.played = "true";
            if (playSound) soundManager.tick((index / words.length - 0.5) * 0.4);
          }
          // Revealed — full opacity, white
          word.style.opacity = "1";
          word.style.color = "#fafafa";
          word.style.textShadow = "none";
        } else {
          word.dataset.played = "false";
          // Unrevealed — faded
          word.style.opacity = "0.2";
          word.style.color = "#525252";
          word.style.textShadow = "none";
        }
      });

      // Highlight most recently revealed word in red
      let latestRevealed = -1;
      wordsRef.current.forEach((word, index) => {
        if (word.style.opacity === "1") latestRevealed = index;
      });
      if (latestRevealed !== -1 && latestRevealed < wordsRef.current.length) {
        const active = wordsRef.current[latestRevealed];
        active.style.color = "#ff2020";
        active.style.textShadow = "0 0 8px rgba(255, 32, 32, 0.6)";
      }
    }

    // Use IntersectionObserver to detect when the container is near the viewport
    // Then use rAF-throttled scroll handler only while visible

    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateWords);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleScroll();
            window.addEventListener("scroll", handleScroll, { passive: true });
          } else {
            window.removeEventListener("scroll", handleScroll);
          }
        });
      },
      { threshold: [0, 0.1, 0.2, 0.5] },
    );

    observerRef.current.observe(el);
    // Initial render
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      observerRef.current?.disconnect();
    };
  }, [words.length, playSound]);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
      className={`${className} select-none`}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="reveal-word inline-block"
          style={{
            opacity: 0.2,
            color: "#525252",
            transition: "opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease, text-shadow 0.15s ease",
            willChange: "opacity, color",
          }}
          data-played="false"
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

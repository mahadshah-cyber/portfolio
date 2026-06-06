"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionColor {
  id: string;
  color: string;
}

const sections: SectionColor[] = [
  { id: "hero", color: "#000000" },
  { id: "about", color: "#0a0510" },
  { id: "skills", color: "#05030a" },
  { id: "certifications", color: "#030208" },
  { id: "projects", color: "#000000" },
  { id: "contact", color: "#08040e" },
];

/**
 * Smoothly transitions the page background color as the user scrolls between sections.
 * Uses GSAP ScrollTrigger scrub for fluid interpolation — like a dimmer switch.
 */
export function BackgroundTransition() {
  useEffect(() => {
    gsap.set("body", { backgroundColor: "#000000" });
    const ctx = gsap.context(() => {
      sections.forEach(({ id, color }) => {
        const section = document.getElementById(id);
        if (!section) return;

        gsap.to("body", {
          backgroundColor: color,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}

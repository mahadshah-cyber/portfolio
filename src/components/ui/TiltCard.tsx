"use client";

import { useRef, ReactNode, useCallback } from "react";
import gsap from "gsap";
import { soundManager } from "@/lib/sound";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 800,
      });

      if (glare && glareRef.current) {
        const hx = (x / rect.width) * 100;
        const hy = (y / rect.height) * 100;
        glareRef.current.style.setProperty("--mouse-x", `${hx}%`);
        glareRef.current.style.setProperty("--mouse-y", `${hy}%`);
        glareRef.current.style.opacity = "1";
      }
    },
    [maxTilt, glare],
  );

  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const pan = (e.clientX / window.innerWidth - 0.5) * 2;
    soundManager.hover(pan);
  }, []);

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        ref={cardRef}
        className="relative transition-shadow duration-500"
        style={{ transformStyle: "preserve-3d" }}
      >
        {glare && (
          <div
            ref={glareRef}
            className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-10 rounded-[inherit]"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 65%)",
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

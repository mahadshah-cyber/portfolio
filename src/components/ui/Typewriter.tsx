"use client";

import { useEffect, useRef, useState } from "react";
import { soundManager } from "@/lib/sound";

interface TypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({
  texts,
  className = "",
  speed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Typing loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    function tick() {
      const currentText = texts[textIndexRef.current];
      const isDeleting = isDeletingRef.current;
      const charIndex = charIndexRef.current;

      if (!isDeleting) {
        if (charIndex < currentText.length) {
          charIndexRef.current += 1;
          setDisplayText(currentText.slice(0, charIndexRef.current));
          soundManager.tick();
          timeout = setTimeout(tick, speed);
        } else {
          timeout = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, pauseDuration);
        }
      } else {
        if (charIndex > 0) {
          charIndexRef.current -= 1;
          setDisplayText(currentText.slice(0, charIndexRef.current));
          timeout = setTimeout(tick, deleteSpeed);
        } else {
          isDeletingRef.current = false;
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          timeout = setTimeout(tick, speed);
        }
      }
    }

    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [texts, speed, deleteSpeed, pauseDuration]);

  return (
    <span
      className={className}
      style={{
        background: "none",
        border: "none",
        outline: "none",
        boxShadow: "none",
        padding: 0,
        margin: 0,
        display: "inline",
      }}
    >
      {displayText}
      <span
        style={{
          color: "#ef4444",
          fontWeight: 300,
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
          userSelect: "none",
        }}
      >
        |
      </span>
    </span>
  );
}

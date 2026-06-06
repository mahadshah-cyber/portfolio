"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { soundManager } from "@/lib/sound";

interface SoundContextType {
  enabled: boolean;
  toggle: () => void;
}

const SoundContext = createContext<SoundContextType>({
  enabled: true,
  toggle: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    // Read preference during initial render — no setState in effect needed
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("mahad-sound-enabled") !== "false";
    } catch {
      return true;
    }
  });

  const interactedRef = useRef(false);

  useEffect(() => {
    if (interactedRef.current) return;

    function handleInteraction() {
      if (interactedRef.current) return;
      interactedRef.current = true;
      soundManager.initSound();
      soundManager.ambientDrone();
      // Clean up non-gesture events after init
      window.removeEventListener("mousemove", handleInteraction);
    }

    // Register on both gesture events (for audio unlock) and mouse movement (for early init)
    const gestureEvents = ["click", "keydown", "touchstart", "pointerdown"];
    const earlyEvents = ["mousemove"];

    gestureEvents.forEach((ev) =>
      window.addEventListener(ev, handleInteraction, {
        once: true,
        passive: true,
      }),
    );
    earlyEvents.forEach((ev) =>
      window.addEventListener(ev, handleInteraction, {
        once: true,
        passive: true,
      }),
    );

    return () => {
      [...gestureEvents, ...earlyEvents].forEach((ev) =>
        window.removeEventListener(ev, handleInteraction),
      );
    };
  }, []);

  function toggle() {
    soundManager.toggle();
    const next = soundManager.isEnabled();
    setEnabled(next);
  }

  return (
    <SoundContext.Provider value={{ enabled, toggle }}>
      {children}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass-card border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-red-900/50 transition-all duration-300 interactive hover:scale-110 hover:shadow-[0_0_20px_rgba(255,32,32,0.2)]"
        aria-label="Toggle sound"
        title={enabled ? "Mute sounds" : "Enable sounds"}
      >
        {enabled ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

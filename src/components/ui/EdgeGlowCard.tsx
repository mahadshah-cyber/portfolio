"use client";

import { ReactNode, useId } from "react";

interface EdgeGlowCardProps {
  children: ReactNode;
  className?: string;
  beadColor?: string;
  duration?: string;
  beadLength?: number;
  hoverOnly?: boolean;
  borderRadius?: number;
  strokeWidth?: number;
}

export function EdgeGlowCard({
  children,
  className = "",
  beadColor = "#ff2020", // The sharp laser color (defaults to cinematic neon red)
  duration = "4.5s",     // Speed of the loop
  beadLength = 18,       // Length of the laser bead (percentage of card perimeter)
  hoverOnly = false,     // If true, the border glows and animates only on hover
  borderRadius = 16,     // Rounded corners radius in pixels (matches rounded-2xl)
  strokeWidth = 1.5,     // Thickness of the sharp laser bead
}: EdgeGlowCardProps) {
  // Generate a stable unique ID for gradients and filters on the client-side
  const id = useId();
  const cleanId = id.replace(/:/g, ""); // Remove colons to make it a safe selector
  const gradId = `edge-glow-grad-${cleanId}`;
  const filterId = `edge-glow-filter-${cleanId}`;

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,32,32,0.08)] ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* SVG Canvas Overlay (Edge-Glow Track) */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none z-30 transition-all duration-700 ${
          hoverOnly ? "opacity-0 group-hover:opacity-100 scale-[0.99] group-hover:scale-100" : "opacity-100"
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Linear gradient that moves the laser colors */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={beadColor} />
            <stop offset="35%" stopColor={beadColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={beadColor} stopOpacity="0.1" />
            <stop offset="85%" stopColor={beadColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={beadColor} />
          </linearGradient>

          {/* SVG Gaussian Blur to produce a realistic vector neon glare */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Neon Glow Base: Slightly thicker and blurred vector stroke */}
        <rect
          x={strokeWidth}
          y={strokeWidth}
          width={`calc(100% - ${strokeWidth * 2}px)`}
          height={`calc(100% - ${strokeWidth * 2}px)`}
          rx={borderRadius - strokeWidth}
          ry={borderRadius - strokeWidth}
          fill="none"
          stroke={beadColor}
          strokeWidth={strokeWidth * 2}
          opacity="0.35"
          filter={`url(#${filterId})`}
          pathLength="100" // Treats perimeter as exactly 100 units for perfect responsive dash math
          className="edge-glow-rect"
          style={{
            strokeDasharray: `${beadLength} ${100 - beadLength}`,
            animation: `edge-glow-bead ${duration} linear infinite`,
          }}
        />

        {/* 2. Razor-Sharp Core Bead: Thin, high-intensity color gradient */}
        <rect
          x={strokeWidth}
          y={strokeWidth}
          width={`calc(100% - ${strokeWidth * 2}px)`}
          height={`calc(100% - ${strokeWidth * 2}px)`}
          rx={borderRadius - strokeWidth}
          ry={borderRadius - strokeWidth}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          pathLength="100"
          className="edge-glow-rect"
          style={{
            strokeDasharray: `${beadLength} ${100 - beadLength}`,
            animation: `edge-glow-bead ${duration} linear infinite`,
          }}
        />
      </svg>

      {/* Card Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, memo } from "react";

export const DigitalRain = memo(function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize canvas context settings
    if (!ctx) return;

    let w = canvas.parentElement?.clientWidth || window.innerWidth;
    let h = canvas.parentElement?.clientHeight || 800;
    canvas.width = w;
    canvas.height = h;

    // Initially paint background black to avoid flash
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const fontSize = 14;
    const columns = Math.floor(w / fontSize) + 1;
    const drops: number[] = [];
    
    // Initialize drops at random negative offsets for natural staggered entrance
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100);
    }

    const chars = "0101010101ABCDEFUXYZアイウエオカキクケコサシスセソタチツテト";

    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // Throttle to 24 FPS for cinematic retro feel and extreme CPU savings

    function draw(timestamp: number) {
      animationFrameId = requestAnimationFrame(draw);

      // Throttle logic
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = timestamp - (elapsed % fpsInterval);

      // Semi-transparent black overlay to create trailing fade effect
      ctx!.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx!.fillRect(0, 0, w, h);

      ctx!.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of the stream is bright red/white, trail is deep red
        if (Math.random() > 0.93) {
          ctx!.fillStyle = "#ffdddd"; // Glowing white-red head
        } else {
          ctx!.fillStyle = "rgba(160, 10, 10, 0.8)"; // Premium deep crimson trail
        }

        ctx!.fillText(char, x, y);

        // Reset drop to top once it goes off screen with random stagger
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    // Start drawing
    animationFrameId = requestAnimationFrame(draw);

    // Optimized resize handler using debounce/throttle style
    let resizeTimeout: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!canvas) return;
        w = canvas.parentElement?.clientWidth || window.innerWidth;
        h = canvas.parentElement?.clientHeight || 800;
        canvas.width = w;
        canvas.height = h;
        
        // Repopulate column grid if dimensions grew
        const newCols = Math.floor(w / fontSize) + 1;
        if (newCols > drops.length) {
          for (let i = drops.length; i < newCols; i++) {
            drops[i] = Math.floor(Math.random() * -100);
          }
        }
        
        // Repaint black background to avoid glitching
        if (ctx) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, w, h);
        }
      }, 150);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
});

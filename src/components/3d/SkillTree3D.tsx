"use client";

import { useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/lib/sound";

// ─── Skill Data ───
interface SkillNode {
  id: string;
  name: string;
  level: number;
  category: string;
  color: string;
}

const skills: SkillNode[] = [
  // Languages
  { id: "c", name: "C Programming", level: 65, category: "Languages", color: "#555555" },
  { id: "java", name: "Java", level: 60, category: "Languages", color: "#ED8B00" },
  { id: "python", name: "Python", level: 45, category: "Languages", color: "#3776AB" },
  // Web
  { id: "html", name: "HTML/CSS", level: 75, category: "Web", color: "#E34F26" },
  { id: "js", name: "JavaScript", level: 70, category: "Web", color: "#F7DF1E" },
  { id: "react", name: "React/Next.js", level: 55, category: "Web", color: "#61DAFB" },
  // Security
  { id: "cyber", name: "Cybersecurity", level: 40, category: "Security", color: "#FF2020" },
  // Data
  { id: "sql", name: "SQL", level: 50, category: "Data", color: "#4479A1" },
  // Tools
  { id: "git", name: "Git/GitHub", level: 65, category: "Tools", color: "#F05032" },
  { id: "linux", name: "Linux", level: 45, category: "Tools", color: "#FCC624" },
];

const categories = [
  { name: "Languages", color: "#555555", skills: ["c", "java", "python"], startAngle: 0, arc: Math.PI * 0.4 },
  { name: "Web", color: "#61DAFB", skills: ["html", "js", "react"], startAngle: Math.PI * 0.4, arc: Math.PI * 0.4 },
  { name: "Security", color: "#FF2020", skills: ["cyber"], startAngle: Math.PI * 0.8, arc: Math.PI * 0.2 },
  { name: "Data", color: "#4479A1", skills: ["sql"], startAngle: Math.PI * 1.0, arc: Math.PI * 0.2 },
  { name: "Tools", color: "#F05032", skills: ["git", "linux"], startAngle: Math.PI * 1.2, arc: Math.PI * 0.4 },
];

export function SkillTree3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, px: 0, py: 0 });
  const timeRef = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ w: 700, h: 500 });
  const canvasSizeRef = useRef({ w: 1400, h: 1000 });

  useEffect(() => {
    function resize() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = 500;
      dimensionsRef.current = { w, h };
      canvasSizeRef.current = { w: w * 2, h: h * 2 };
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TWO_PI = Math.PI * 2;

    const draw = () => {
      const { w, h } = dimensionsRef.current;
      const cw = canvasSizeRef.current.w;
      const ch = canvasSizeRef.current.h;
      if (!canvas || !ctx) return;

      canvas.width = cw;
      canvas.height = ch;
      ctx.clearRect(0, 0, cw, ch);
      ctx.scale(cw / w, ch / h);

      timeRef.current += 0.005;
      const rot = timeRef.current;
      const { x: mx, y: my, px: mpx, py: mpy } = mouseRef.current;

      const cx = w / 2;
      const cy = h / 2 + 20;
      const orbitRadius = Math.min(w, h) * 0.32;

      // ─── Compute Node Positions with Magnetic Influence ───
      const nodePositions: { x: number; y: number; z: number; scale: number }[] = [];
      const nodeDepths: number[] = [];

      skills.forEach((skill) => {
        const catIdx = categories.findIndex((c) => c.skills.includes(skill.id));
        const cat = categories[catIdx];
        const skillIdxInCat = cat.skills.indexOf(skill.id);
        const skillCountInCat = cat.skills.length;

        const catMidAngle = cat.startAngle + cat.arc / 2;
        const angleOffset = skillCountInCat > 1
          ? (skillIdxInCat / (skillCountInCat - 1) - 0.5) * cat.arc * 0.8
          : 0;
        const angle = catMidAngle + angleOffset + rot * 0.02;
        const distFromCenter = orbitRadius * (0.65 + (skill.level / 100) * 0.5);

        let x3d = Math.cos(angle) * distFromCenter;
        let z3d = Math.sin(angle) * distFromCenter * 0.5;
        let y3d = (catIdx - 2) * 15 + Math.sin(angle * 2) * 10;

        // Apply mouse rotation
        const mouseRotX = (mx - 0.5) * 0.4;
        const mouseRotY = (my - 0.5) * 0.3;

        const cosX = Math.cos(mouseRotX);
        const sinX = Math.sin(mouseRotX);
        const y1 = y3d * cosX - z3d * sinX;
        const z1 = y3d * sinX + z3d * cosX;
        y3d = y1; z3d = z1;

        const cosY = Math.cos(mouseRotY);
        const sinY = Math.sin(mouseRotY);
        const x1 = x3d * cosY - z3d * sinY;
        const z2 = x3d * sinY + z3d * cosY;
        x3d = x1; z3d = z2;

        const scale = 400 / (400 + z3d);
        let px = cx + x3d * scale;
        let py = cy + y3d * scale;

        // Magnetic Pull
        const dx = mpx - px;
        const dy = mpy - py;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 100) {
          const force = (1 - distToMouse / 100) * 15;
          px += (dx / distToMouse) * force;
          py += (dy / distToMouse) * force;
        }

        nodeDepths.push(z3d);
        nodePositions.push({ x: px, y: py, z: z3d, scale });
      });

      const sortedIndices = nodeDepths.map((_, i) => i).sort((a, b) => nodeDepths[a] - nodeDepths[b]);

      // ─── Drawing Logic ───
      // Neural Connections
      categories.forEach((cat) => {
        cat.skills.forEach((idA, i) => {
          cat.skills.slice(i + 1).forEach((idB) => {
            const idxA = skills.findIndex(s => s.id === idA);
            const idxB = skills.findIndex(s => s.id === idB);
            const a = nodePositions[idxA];
            const b = nodePositions[idxB];
            if (!a || !b) return;

            const isHovered = hoveredRef.current === idxA || hoveredRef.current === idxB;
            ctx.strokeStyle = cat.color + (isHovered ? "44" : "11");
            ctx.lineWidth = isHovered ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Energy Pulse
            const pulse = (rot * 1.5 + idxA * 0.2) % 1;
            ctx.fillStyle = cat.color + (isHovered ? "88" : "33");
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * pulse, a.y + (b.y - a.y) * pulse, isHovered ? 3 : 1.5, 0, TWO_PI);
            ctx.fill();
          });
        });
      });

      // Hub and Nodes
      sortedIndices.forEach((i) => {
        const pos = nodePositions[i];
        const skill = skills[i];
        const isHovered = hoveredRef.current === i;
        const nodeR = (isHovered ? 24 : 18) * pos.scale;

        // Node Glow
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeR * 2.5);
        grad.addColorStop(0, skill.color + (isHovered ? "40" : "15"));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR * 2.5, 0, TWO_PI);
        ctx.fill();

        // Node Main
        ctx.fillStyle = skill.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR, 0, TWO_PI);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(pos.x - nodeR * 0.3, pos.y - nodeR * 0.3, nodeR * 0.3, 0, TWO_PI);
        ctx.fill();

        // Level Arc
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeR + 4, -Math.PI / 2, -Math.PI / 2 + (skill.level / 100) * TWO_PI);
        ctx.stroke();

        // Text
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.round(11 * pos.scale)}px font-mono`;
        ctx.textAlign = "center";
        ctx.fillText(`${skill.level}%`, pos.x, pos.y + 4);
        
        if (isHovered) {
          ctx.font = `bold 12px font-mono`;
          ctx.fillText(skill.name, pos.x, pos.y - nodeR - 10);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const orbitRadius = 200; // Simplified for hit test

  const onCanvasMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove(e);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: number | null = null;
    skills.forEach((skill, idx) => {
      // Very simplified hit test for performance
      const catIdx = categories.findIndex((c) => c.skills.includes(skill.id));
      const distFromCenter = orbitRadius * (0.65 + (skill.level / 100) * 0.5);
      const angle = (catIdx * 1.2) + timeRef.current * 0.02;
      const px = dimensionsRef.current.w / 2 + Math.cos(angle) * distFromCenter;
      const py = dimensionsRef.current.h / 2 + Math.sin(angle) * distFromCenter * 0.5;
      
      const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (dist < 40) found = idx;
    });

    if (found !== hoveredRef.current) {
      if (found !== null) {
        const pan = (e.clientX / window.innerWidth - 0.5) * 2;
        soundManager.hover(pan);
      }
      hoveredRef.current = found;
    }
  }, [onMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] bg-zinc-950/20 rounded-2xl border border-zinc-800/40 overflow-hidden"
      onMouseMove={onCanvasMove}
      onMouseLeave={() => { hoveredRef.current = null; }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-4 left-6 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
        Neural Skill Network — v2.0
      </div>
    </div>
  );
}

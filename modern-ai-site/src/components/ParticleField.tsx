"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

const PARTICLE_COUNT = 80;
const CONNECTION_DIST = 140;
const MOUSE_RADIUS = 200;
const MOUSE_FORCE = 0.08;
const RETURN_SPEED = 0.02;
const DRIFT_SPEED = 0.15;

export default function ParticleField({ mouseRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animId = useRef<number>(0);
  const dims = useRef({ w: 0, h: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    const arr: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      arr.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
    particles.current = arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dims.current = { w, h };
      if (particles.current.length === 0) initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const { w, h } = dims.current;
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, w, h);

      const pts = particles.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        /* Ambient drift */
        p.x += p.vx;
        p.y += p.vy;

        /* Bounce off edges softly */
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        /* Mouse repulsion — particles flee from cursor */
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.x += (dx / dist) * force * MOUSE_FORCE * 12;
            p.y += (dy / dist) * force * MOUSE_FORCE * 12;
          }
        }

        /* Gently return toward base position */
        p.x += (p.baseX - p.x) * RETURN_SPEED * 0.3;
        p.y += (p.baseY - p.y) * RETURN_SPEED * 0.3;

        /* Draw particle */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      /* Draw connections between nearby particles */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* Glow around mouse */
      if (mouse) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_RADIUS,
        );
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.06)");
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animId.current = requestAnimationFrame(loop);
    };

    animId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
    };
  }, [mouseRef, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}

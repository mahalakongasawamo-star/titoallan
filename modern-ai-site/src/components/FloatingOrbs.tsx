"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface OrbConfig {
  size: number;
  x: string;
  y: string;
  color: string;
  breathDuration: number;
  floatDuration: number;
  floatDistance: number;
  delay: number;
}

const orbs: OrbConfig[] = [
  {
    size: 300,
    x: "12%",
    y: "15%",
    color: "rgba(99, 102, 241, 0.12)",
    breathDuration: 4,
    floatDuration: 8,
    floatDistance: 30,
    delay: 0,
  },
  {
    size: 220,
    x: "75%",
    y: "25%",
    color: "rgba(168, 85, 247, 0.10)",
    breathDuration: 5,
    floatDuration: 10,
    floatDistance: 25,
    delay: 1.2,
  },
  {
    size: 260,
    x: "55%",
    y: "70%",
    color: "rgba(236, 72, 153, 0.08)",
    breathDuration: 6,
    floatDuration: 12,
    floatDistance: 35,
    delay: 0.6,
  },
  {
    size: 180,
    x: "25%",
    y: "75%",
    color: "rgba(34, 211, 238, 0.07)",
    breathDuration: 4.5,
    floatDuration: 9,
    floatDistance: 20,
    delay: 2,
  },
  {
    size: 140,
    x: "85%",
    y: "65%",
    color: "rgba(139, 92, 246, 0.09)",
    breathDuration: 3.5,
    floatDuration: 7,
    floatDistance: 18,
    delay: 1.5,
  },
];

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

function Orb({ config, mouseRef }: { config: OrbConfig; mouseRef: Props["mouseRef"] }) {
  const orbRef = useRef<HTMLDivElement>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const smoothX = useSpring(offsetX, { stiffness: 30, damping: 20, mass: 2 });
  const smoothY = useSpring(offsetY, { stiffness: 30, damping: 20, mass: 2 });

  useEffect(() => {
    let raf: number;
    const REPEL_RADIUS = 350;

    const update = () => {
      const el = orbRef.current;
      const mouse = mouseRef.current;
      if (!el || !mouse) {
        raf = requestAnimationFrame(update);
        return;
      }

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 60;
        offsetX.set((dx / dist) * force);
        offsetY.set((dy / dist) * force);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef, offsetX, offsetY]);

  return (
    <motion.div
      ref={orbRef}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: config.size,
        height: config.size,
        left: config.x,
        top: config.y,
        x: smoothX,
        y: smoothY,
        background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
        filter: "blur(40px)",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6],
        y: [0, -config.floatDistance, 0],
      }}
      transition={{
        scale: {
          duration: config.breathDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: config.delay,
        },
        opacity: {
          duration: config.breathDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: config.delay,
        },
        y: {
          duration: config.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: config.delay,
        },
      }}
    />
  );
}

export default function FloatingOrbs({ mouseRef }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden z-[1]" aria-hidden="true">
      {orbs.map((config, i) => (
        <Orb key={i} config={config} mouseRef={mouseRef} />
      ))}
    </div>
  );
}

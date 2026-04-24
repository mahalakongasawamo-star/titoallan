"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Props {
  lines: string[];
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  mounted: boolean;
}

export default function RevealText({ lines, mouseRef, mounted }: Props) {
  return (
    <h1
      className="text-[clamp(2.2rem,6vw,5rem)] font-bold tracking-tight leading-[1.05] text-white mb-8"
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {mounted
            ? line.split("").map((char, ci) => {
                if (char === " ") {
                  return (
                    <span key={`${li}-${ci}`} className="inline-block w-[0.3em]">
                      &nbsp;
                    </span>
                  );
                }
                return (
                  <MagneticChar
                    key={`${li}-${ci}`}
                    char={char}
                    mouseRef={mouseRef}
                  />
                );
              })
            : line}
        </span>
      ))}
    </h1>
  );
}

function MagneticChar({
  char,
  mouseRef,
}: {
  char: string;
  mouseRef: Props["mouseRef"];
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

  useEffect(() => {
    let raf: number;
    const ATTRACT_RADIUS = 120;
    const ATTRACT_FORCE = 8;

    const update = () => {
      const el = ref.current;
      const mouse = mouseRef.current;
      if (!el || !mouse) {
        raf = requestAnimationFrame(update);
        return;
      }

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < ATTRACT_RADIUS && dist > 0) {
        const force =
          ((ATTRACT_RADIUS - dist) / ATTRACT_RADIUS) * ATTRACT_FORCE;
        x.set((dx / dist) * force);
        y.set((dy / dist) * force);
      } else {
        x.set(0);
        y.set(0);
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef, x, y]);

  return (
    <motion.span
      ref={ref}
      className="inline-block will-change-transform"
      style={{ x: smoothX, y: smoothY }}
    >
      {char}
    </motion.span>
  );
}

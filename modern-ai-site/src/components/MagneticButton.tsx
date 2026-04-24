"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Props {
  label: string;
  href: string;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

const PULL_RADIUS = 200;
const PULL_STRENGTH = 25;

export default function MagneticButton({ label, href, mouseRef }: Props) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  /* Raw displacement values — updated every frame, no React re-renders */
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);

  /* Spring-smoothed output */
  const springX = useSpring(dx, { stiffness: 200, damping: 20, mass: 0.6 });
  const springY = useSpring(dy, { stiffness: 200, damping: 20, mass: 0.6 });

  /* Proximity 0-1 drives the glow intensity */
  const proximity = useMotionValue(0);
  const springProx = useSpring(proximity, {
    stiffness: 120,
    damping: 25,
    mass: 0.5,
  });
  const glowOpacity = useTransform(springProx, [0, 1], [0, 0.6]);
  const glowScale = useTransform(springProx, [0, 1], [1, 1.3]);

  useEffect(() => {
    let raf: number;

    const update = () => {
      const el = btnRef.current;
      const mouse = mouseRef.current;
      if (!el || !mouse) {
        raf = requestAnimationFrame(update);
        return;
      }

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const deltaX = mouse.x - cx;
      const deltaY = mouse.y - cy;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < PULL_RADIUS && dist > 0) {
        const force =
          ((PULL_RADIUS - dist) / PULL_RADIUS) * PULL_STRENGTH;
        dx.set((deltaX / dist) * force);
        dy.set((deltaY / dist) * force);
        proximity.set((PULL_RADIUS - dist) / PULL_RADIUS);
      } else {
        dx.set(0);
        dy.set(0);
        proximity.set(0);
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef, dx, dy, proximity]);

  return (
    <motion.div
      className="relative inline-block"
      style={{ x: springX, y: springY }}
    >
      {/* Reactive glow */}
      <motion.div
        className="absolute -inset-3 rounded-full bg-violet-500/30 blur-2xl pointer-events-none"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />

      {/* Pulsing ambient glow */}
      <motion.div
        className="absolute -inset-2 rounded-sm bg-white/10 blur-xl pointer-events-none"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center gap-3 px-10 py-4
                   text-[11px] tracking-[0.25em] font-medium
                   bg-white text-[#0a0a0a] overflow-hidden group"
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Hover fill sweep */}
        <span
          className="absolute inset-0 bg-violet-600 origin-left scale-x-0
                     group-hover:scale-x-100 transition-transform duration-500 ease-out"
        />

        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          {label}
        </span>
        <ArrowUpRight
          size={14}
          className="relative z-10 group-hover:text-white transition-colors duration-300"
        />
      </motion.a>
    </motion.div>
  );
}

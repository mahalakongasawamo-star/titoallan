"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ParticleField from "./ParticleField";
import FloatingOrbs from "./FloatingOrbs";
import RevealText from "./RevealText";
import MagneticButton from "./MagneticButton";
import {
  HEADLINE_LINES,
  HERO_TAGLINE,
  HERO_BODY,
  HERO_STAT,
  HERO_CHATGPT_STAT,
  HERO_STARTING_PRICE,
  HERO_CTA_LABEL,
} from "@/content/hero";

export default function InteractiveHero() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // default true = safe SSR

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);

    if (mq.matches) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleScrollDown = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Particle network — only after mount, desktop only */}
      {mounted && !isMobile && <ParticleField mouseRef={mouseRef} />}

      {/* Breathing orbs — only after mount */}
      {mounted && <FloatingOrbs mouseRef={mouseRef} />}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat" />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(5,5,5,0.8) 100%)",
        }}
      />

      {/* Content — always visible in SSR, animates on mount */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 sm:px-10 lg:px-16 py-32">
        <FadeUp delay={0.1} mounted={mounted}>
          <span className="block text-[10px] tracking-[0.35em] text-white/40 font-medium uppercase mb-8">
            {HERO_TAGLINE}
          </span>
        </FadeUp>

        <RevealText lines={HEADLINE_LINES} mouseRef={mouseRef} mounted={mounted} />

        <FadeUp delay={0.9} mounted={mounted}>
          <p className="text-base sm:text-lg leading-[1.8] text-white/55 mb-5 max-w-xl">
            {HERO_BODY[0]}
          </p>
        </FadeUp>

        <FadeUp delay={1.0} mounted={mounted}>
          <p className="text-sm leading-[1.8] text-white/45 mb-5 max-w-xl">
            {HERO_BODY[1]}
          </p>
        </FadeUp>

        <FadeUp delay={1.1} mounted={mounted}>
          <p className="text-sm leading-[1.8] text-white/45 mb-12 max-w-xl">
            {HERO_CHATGPT_STAT}
          </p>
        </FadeUp>

        <FadeUp delay={1.2} mounted={mounted}>
          <div className="border-l border-white/[0.18] pl-7 mb-10">
            <StatCounter target={HERO_STAT.target} mounted={mounted} />
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              {HERO_STAT.label}
            </p>
            <span className="text-[10px] tracking-[0.2em] text-white/[0.38] uppercase">
              {HERO_STAT.source}
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={1.3} mounted={mounted}>
          <p className="text-[11px] tracking-[0.2em] text-white/45 uppercase mb-7">
            STARTING AT <strong className="text-white/80">{HERO_STARTING_PRICE}</strong>
          </p>
        </FadeUp>

        <FadeUp delay={1.4} mounted={mounted}>
          <MagneticButton
            label={HERO_CTA_LABEL}
            href="#features"
            mouseRef={mouseRef}
          />
        </FadeUp>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-white/60 transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}

/* ── FadeUp wrapper: content always visible, subtle animation on mount ── */
function FadeUp({
  children,
  delay,
  mounted,
}: {
  children: React.ReactNode;
  delay: number;
  mounted: boolean;
}) {
  /* No animation wrapper at all — content is always immediately visible */
  return <>{children}</>;
}

/* ── Stat counter ── */
function StatCounter({ target, mounted }: { target: number; mounted: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          const duration = 2000;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, mounted]);

  return (
    <div ref={ref} className="text-7xl sm:text-8xl lg:text-[120px] font-bold text-white leading-none mb-3">
      <span className="tabular-nums">{mounted ? count : target}</span>%
    </div>
  );
}

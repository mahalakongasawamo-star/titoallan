"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MeshGradient from "./MeshGradient";
import StaggeredTitle from "./StaggeredTitle";
import CTAButton from "./CTAButton";

/* Shared spring-based fade-up helper */
const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 60,
    damping: 18,
    mass: 1,
    delay,
  },
});

export default function HeroSection() {
  const handleScrollDown = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Animated mesh gradient — shifts colors on slow loops */}
      <MeshGradient />

      {/* Overlay for text legibility */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[860px] mx-auto px-6 sm:px-10 lg:px-16 py-32">
        <motion.span
          className="block text-[10px] tracking-[0.3em] text-white/50 font-medium uppercase mb-8"
          {...fadeUp(0.1)}
        >
          AI-FRIENDLY WEB DESIGN FOR SMALL AND MEDIUM BUSINESSES
        </motion.span>

        <StaggeredTitle />

        <motion.p
          className="text-sm sm:text-base leading-[1.9] text-white/70 mb-5 max-w-2xl"
          {...fadeUp(0.7)}
        >
          Upserv is a web design agency that rebuilds and redesigns websites for
          small and medium businesses so they appear in AI-driven
          recommendations&nbsp;&mdash; ChatGPT&nbsp;Ads, Google&nbsp;MUM,
          Perplexity, Grok, and Meta&nbsp;Andromeda.
        </motion.p>

        <motion.p
          className="text-sm sm:text-base leading-[1.9] text-white/70 mb-5 max-w-2xl"
          {...fadeUp(0.84)}
        >
          We serve dental clinics, medical practices, restaurants, retail
          stores, auto repair shops, electricians, plumbers, and law firms
          across the United States.
        </motion.p>

        <motion.p
          className="text-sm sm:text-base leading-[1.9] text-white/70 mb-10 max-w-2xl"
          {...fadeUp(0.98)}
        >
          On{" "}
          <strong className="text-white font-semibold">
            February&nbsp;9,&nbsp;2026
          </strong>
          , ChatGPT launched advertising to 900&nbsp;million users. AI now
          surfaces 3&ndash;5 businesses per query&nbsp;&mdash; not pages of
          links. An analysis of 350,000 local businesses found{" "}
          <strong className="text-white font-semibold">
            98.8% were absent from ChatGPT recommendations entirely.
          </strong>
        </motion.p>

        {/* Stat counter */}
        <motion.div
          className="border-l border-white/[0.18] pl-7 mb-10"
          {...fadeUp(1.1)}
        >
          <StatCounter target={93} />
          <p className="text-sm text-white/70 leading-relaxed mb-2">
            Of Google AI Mode Searches End Without A Single Click.
          </p>
          <span className="text-[10px] tracking-[0.2em] text-white/[0.38] uppercase">
            Source: Semrush, 2025
          </span>
        </motion.div>

        {/* Price */}
        <motion.p
          className="text-[11px] tracking-[0.2em] text-white/45 uppercase mb-7"
          {...fadeUp(1.2)}
        >
          STARTING AT <strong className="text-white/80">$1,000</strong>
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(1.35)}>
          <CTAButton />
        </motion.div>
      </div>

      {/* Bouncing scroll-down indicator — Lucide ChevronDown */}
      <motion.button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                   text-white/40 hover:text-white/70 transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}

/* ── Intersection-triggered counter ── */
function StatCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2200;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
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
  }, [target]);

  return (
    <div
      ref={ref}
      className="text-7xl sm:text-8xl lg:text-[120px] font-bold text-white leading-none mb-3"
    >
      <span>{count}</span>%
    </div>
  );
}

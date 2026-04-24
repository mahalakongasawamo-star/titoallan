"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";

import { tiers } from "@/content/pricing";

const PricingCanvas = lazy(() => import("./PricingCanvas"));

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 16 },
  },
};

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [opacityProgress, setOpacityProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let trigger: { kill: () => void } | null = null;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self: { progress: number }) => {
          setRotationProgress(self.progress);
          setOpacityProgress(Math.min(self.progress / 0.5, 1));
          setTextProgress(
            Math.min(Math.max((self.progress - 0.1) / 0.35, 0), 1),
          );
        },
      });
    })();

    return () => {
      trigger?.kill();
    };
  }, []);

  const textOpacity = 0 + textProgress * 1;
  const textY = 60 - textProgress * 60;
  const textBlur = 8 - textProgress * 8;

  return (
    <section
      ref={sectionRef}
      id="models"
      className="theme-section relative py-28 sm:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Hero row: fade-in text (left) + 3D Torus (center/right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 sm:mb-28">
          {/* Left — scroll-driven text */}
          <div
            style={{
              opacity: mounted ? textOpacity : 0,
              transform: `translateY(${mounted ? textY : 60}px)`,
              filter: `blur(${mounted ? textBlur : 8}px)`,
              transition: "filter 0.1s ease-out",
            }}
          >
            <span className="block text-[10px] tracking-[0.3em] text-[var(--color-text-subtle)] uppercase mb-4">
              INVESTMENT
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6">
              PRICING
              <br />
              STRUCTURES.
            </h2>
            <p className="text-sm tracking-[0.15em] text-[var(--color-text-muted)] uppercase mb-2">
              VERIFIED DATASETS PUSHED TO 19 PLATFORMS.
            </p>
            <p className="text-xs tracking-[0.15em] text-[var(--color-text-subtle)] uppercase">
              + $150/MONTH DATA SUBSCRIPTION REQUIRED FOR ALL TIERS.
            </p>
          </div>

          {/* Right — 3D Torus */}
          <div className="relative h-[350px] sm:h-[450px] lg:h-[500px]">
            {!mounted ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-cyan-500/10 blur-[80px]" />
              </div>
            ) : isMobile ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-cyan-500/25 via-teal-400/15 to-violet-500/10 blur-[60px]" />
              </motion.div>
            ) : (
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" />
                  </div>
                }
              >
                <PricingCanvas
                  rotationProgress={rotationProgress}
                  opacityProgress={opacityProgress}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* ── Pricing cards ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              className="group relative border border-[var(--color-border)] p-8 sm:p-10 hover:border-[var(--color-text-muted)] transition-colors duration-500"
              variants={cardVariant}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <span className="block text-[10px] tracking-[0.3em] text-[var(--color-text-subtle)] uppercase mb-4">
                {tier.label}
              </span>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                {tier.name}
              </h3>
              <p className="text-sm leading-[1.8] text-[var(--color-text-muted)] mb-8">
                {tier.desc}
              </p>
              <span className="text-3xl font-bold text-[var(--color-text)]">
                {tier.price}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

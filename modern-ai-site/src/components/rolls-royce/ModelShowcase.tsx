"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── Animated Section Wrapper ─────────────────────────────────── */
function AnimatedCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: EASING }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Model Card ───────────────────────────────────────────────── */
function ModelCard({
  model,
  large = false,
}: {
  model: {
    name: string;
    tagline: string;
    description: string;
    image: string;
    cta: string;
  };
  large?: boolean;
}) {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-rr-black/5 ${
          large ? "aspect-[16/10] md:aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${model.image})` }}
        />
        {/* Subtle gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Text Content */}
      <div className="mt-6 md:mt-8 px-1">
        <h3
          className={`font-extralight tracking-[0.12em] text-white ${
            large
              ? "text-2xl md:text-3xl lg:text-4xl"
              : "text-xl md:text-2xl lg:text-3xl"
          }`}
        >
          {model.name}
        </h3>
        <p className="text-[11px] md:text-xs tracking-[0.2em] text-white/50 mt-2">
          {model.tagline}
        </p>
        <p className="text-sm md:text-base font-light text-white/60 mt-3 md:mt-4 max-w-md leading-relaxed">
          {model.description}
        </p>

        {/* CTA Link */}
        <div className="mt-5 md:mt-6">
          <span className="group/cta inline-flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.3em] text-white/70 hover:text-rr-gold transition-colors duration-400">
            {model.cta}
            <span className="inline-block w-6 h-[1px] bg-current transition-all duration-500 group-hover/cta:w-10" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Model Showcase Section ───────────────────────────────────── */
export default function ModelShowcase() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="models" className="relative bg-rr-black py-24 md:py-32 lg:py-40">
      {/* Section Header */}
      <div ref={headerRef} className="text-center mb-16 md:mb-24 px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASING }}
          className="text-[10px] tracking-[0.6em] text-rr-gold/70 mb-4"
        >
          THE MARQUE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: EASING }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[-0.01em] text-white"
        >
          {CONTENT.SECTION_MODELS_TITLE}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={headerInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: EASING }}
          className="w-10 h-[1px] bg-rr-gold/40 mx-auto mt-6"
        />
      </div>

      {/* ── Featured Models: 2-Column Grid ──────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          {CONTENT.MODELS_FEATURED.map((model, i) => (
            <AnimatedCard key={model.name} delay={i * 0.15}>
              <ModelCard model={model} large />
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* ── Grid Models: 3-Column Grid ──────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mt-16 md:mt-24 lg:mt-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-14">
          {CONTENT.MODELS_GRID.map((model, i) => (
            <AnimatedCard key={model.name} delay={i * 0.12}>
              <ModelCard model={model} />
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

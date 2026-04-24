"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function BespokeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textRef, { once: true, margin: "-100px" });

  // Parallax effect on the background image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="bespoke"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-rr-black"
    >
      {/* ─── Parallax Background ─────────────────────────────── */}
      <motion.div
        className="absolute inset-0 -top-[10%] -bottom-[10%]"
        style={{ y: bgY }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${CONTENT.BESPOKE_IMAGE})` }}
        />
        {/* Deep cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-rr-black/90 via-rr-black/60 to-rr-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-black/70 via-transparent to-rr-black/40" />
      </motion.div>

      {/* ─── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center min-h-screen px-6 md:px-12 lg:px-20 xl:px-28">
        <div ref={textRef} className="max-w-xl lg:max-w-2xl py-24 md:py-32">
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={textInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: EASING }}
            className="w-16 h-[1px] bg-rr-gold/70 origin-left mb-8"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: EASING }}
            className="text-[10px] md:text-[11px] tracking-[0.5em] text-rr-gold/80 mb-4"
          >
            {CONTENT.BESPOKE_SUBTITLE}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: EASING }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-[-0.02em] text-white leading-[0.9]"
          >
            {CONTENT.BESPOKE_TITLE}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.8, ease: EASING }}
            className="text-sm md:text-base font-light text-white/60 leading-relaxed mt-8 md:mt-10 max-w-lg"
          >
            {CONTENT.BESPOKE_DESCRIPTION}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: EASING }}
            className="mt-10 md:mt-12"
          >
            <a
              href="#"
              className="group inline-flex items-center gap-4 border border-white/25 text-white text-[10px] md:text-[11px] tracking-[0.3em] px-10 md:px-12 py-4 md:py-5 transition-all duration-500 hover:border-rr-gold/50 hover:bg-rr-gold/5"
            >
              {CONTENT.BESPOKE_CTA}
              <span className="inline-block w-5 h-[1px] bg-rr-gold transition-all duration-500 group-hover:w-8" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

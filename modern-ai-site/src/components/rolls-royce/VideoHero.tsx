"use client";

import { motion } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function VideoHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-rr-black">
      {/* ─── Background Image with Ken Burns Scale ───────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASING }}
      >
        {/*
          Replace this <div> with a <video> element for production:
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            src="/rolls-royce-hero.mp4"
          />
        */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${CONTENT.HERO_IMAGE})` }}
          role="img"
          aria-label="Rolls-Royce motor car in a luxurious setting"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      </motion.div>

      {/* ─── Hero Content ────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Subtitle */}
        <motion.p
          className="text-[10px] md:text-xs tracking-[0.6em] text-white/70 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: EASING }}
        >
          {CONTENT.HERO_SUBTITLE}
        </motion.p>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px] 2xl:text-[120px] font-extralight text-white tracking-[-0.02em] leading-[0.9]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: EASING }}
        >
          {CONTENT.HERO_TITLE}
        </motion.h1>

        {/* Thin divider */}
        <motion.div
          className="w-12 h-[1px] bg-rr-gold/60 mt-8 md:mt-10 mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASING }}
        />

        {/* Ghost CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: EASING }}
        >
          <a
            href="#models"
            className="group relative inline-block border border-white/30 text-white text-[10px] md:text-[11px] tracking-[0.35em] px-10 md:px-14 py-4 md:py-5 transition-all duration-600 hover:border-white/60 hover:bg-white hover:text-rr-black"
          >
            <span className="relative z-10">{CONTENT.HERO_CTA}</span>
          </a>
        </motion.div>
      </div>

      {/* ─── Scroll Indicator ────────────────────────────────── */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <motion.span
          className="text-[8px] tracking-[0.4em] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          SCROLL
        </motion.span>
        <motion.div
          className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 2, duration: 0.8 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          }}
        />
      </div>
    </section>
  );
}

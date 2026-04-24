"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RRFooter() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      ref={ref}
      className="relative bg-rr-cobalt overflow-hidden"
    >
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-rr-black/30 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        {/* ── Tagline ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASING }}
          className="pt-20 md:pt-28 lg:pt-36 pb-16 md:pb-20 border-b border-white/10"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-extralight text-white/80 tracking-wide max-w-2xl italic">
            &ldquo;{CONTENT.FOOTER_TAGLINE}&rdquo;
          </p>
          <p className="text-[10px] tracking-[0.4em] text-white/30 mt-4">
            — SIR HENRY ROYCE
          </p>
        </motion.div>

        {/* ── Link Columns ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 lg:gap-16 py-16 md:py-20">
          {CONTENT.FOOTER_SECTIONS.map((section, sIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + sIdx * 0.1,
                duration: 0.8,
                ease: EASING,
              }}
            >
              <h4 className="text-[10px] md:text-[11px] tracking-[0.35em] text-white/50 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="h-[1px] bg-white/10" />

        {/* ── Bottom Bar ──────────────────────────────────────── */}
        <div className="py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Social Links */}
          <div className="flex items-center gap-6 md:gap-8">
            {CONTENT.FOOTER_SOCIAL.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-[10px] tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300"
                aria-label={social.label}
              >
                {social.label.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Brand mark */}
          <div className="flex flex-col items-start md:items-center gap-2">
            <span className="text-[10px] tracking-[0.4em] text-white/30">
              {CONTENT.BRAND_NAME}
            </span>
          </div>

          {/* Legal */}
          <p className="text-[10px] text-white/30 font-light">
            {CONTENT.FOOTER_LEGAL}
          </p>
        </div>
      </div>
    </footer>
  );
}

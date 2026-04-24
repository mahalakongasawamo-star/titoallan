"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ─── Sticky Header ──────────────────────────────────────── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASING }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/10 backdrop-blur-2xl border-b border-white/5 shadow-[0_1px_30px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5 md:py-6">
          {/* Left spacer for centering */}
          <div className="w-20 md:w-28" />

          {/* Centered Logo */}
          <a
            href="#"
            className="flex-1 flex justify-center"
            aria-label="Rolls-Royce Home"
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] md:text-xs tracking-[0.35em] font-light text-white select-none">
                {CONTENT.BRAND_NAME}
              </span>
              <span className="text-[8px] md:text-[9px] tracking-[0.5em] font-light text-white/50 select-none">
                {CONTENT.BRAND_TAGLINE}
              </span>
            </div>
          </a>

          {/* Menu Trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-20 md:w-28 flex justify-end text-[10px] md:text-[11px] tracking-[0.35em] text-white/80 hover:text-white transition-colors duration-300"
            aria-label="Open menu"
          >
            MENU
          </button>
        </nav>
      </motion.header>

      {/* ─── Full-Screen Menu Overlay ───────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-rr-cobalt"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-rr-cobalt via-rr-cobalt to-rr-black/40 pointer-events-none" />

            {/* Close button */}
            <div className="relative z-10 flex justify-end px-6 md:px-12 lg:px-16 py-5 md:py-6">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-[10px] md:text-[11px] tracking-[0.35em] text-white/80 hover:text-white transition-colors duration-300"
                aria-label="Close menu"
              >
                CLOSE
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-6 md:gap-10">
              {CONTENT.NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: EASING,
                  }}
                  onClick={() => setMenuOpen(false)}
                  className="group relative text-3xl md:text-5xl lg:text-6xl font-extralight tracking-[0.15em] text-white/90 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                  {/* Hover underline */}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-rr-gold group-hover:w-full transition-all duration-500" />
                </motion.a>
              ))}

              {/* Subtle brand mark at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-8 text-[9px] tracking-[0.6em] text-white/20"
              >
                {CONTENT.BRAND_NAME}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

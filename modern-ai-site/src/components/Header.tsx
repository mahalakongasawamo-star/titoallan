"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "PLATFORM", href: "#hero" },
  { label: "SOLUTIONS", href: "#explore" },
  { label: "PRODUCTS", href: "#models" },
  { label: "INDUSTRIES", href: "#industry" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 transition-all duration-300 ${
          scrolled
            ? "h-14 bg-[var(--color-bg)]/90 backdrop-blur-md shadow-sm"
            : "h-[70px] bg-transparent"
        }`}
      >
        {/* Left — hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[5px] group"
            aria-label="Open menu"
          >
            <span className="block w-5 h-[1.5px] bg-[var(--color-text)] group-hover:w-6 transition-all" />
            <span className="block w-5 h-[1.5px] bg-[var(--color-text)]" />
            <span className="block w-5 h-[1.5px] bg-[var(--color-text)] group-hover:w-4 transition-all" />
          </button>
          <span className="hidden sm:block text-[10px] tracking-[0.2em] font-medium text-[var(--color-text-muted)] uppercase">
            MENU
          </span>
        </div>

        {/* Center — logo */}
        <a href="#" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/upservai.png"
            alt="upserv.ai"
            width={120}
            height={28}
            className="dark:invert-0"
            priority
          />
        </a>

        {/* Right — theme toggle + CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-text)]/5 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-[10px] tracking-[0.2em] font-medium text-[var(--color-text-light)] bg-[var(--color-text)] hover:opacity-80 transition-opacity"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-[var(--color-text)]"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <ul className="flex flex-col gap-8 text-center">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-bold tracking-tight text-[var(--color-text)] hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

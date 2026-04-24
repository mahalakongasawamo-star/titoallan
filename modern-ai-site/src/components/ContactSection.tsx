"use client";

import { motion } from "framer-motion";
import {
  CONTACT_HEADING,
  CONTACT_HEADING_ACCENT,
  CONTACT_CTA_LABEL,
  CONTACT_BODY,
} from "@/content/contact";
import { FREE_SCAN_URL, SITE_EMAIL } from "@/content/site";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

export default function ContactSection() {
  return (
    <section id="contact" className="theme-section relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.2 }}
        >
          {/* Left */}
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              <span className="text-[var(--color-text)]">
                {CONTACT_HEADING.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < CONTACT_HEADING.length - 1 && <br />}
                  </span>
                ))}
              </span>
              <br />
              <span className="text-violet-400">
                {CONTACT_HEADING_ACCENT.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < CONTACT_HEADING_ACCENT.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </h2>
            <a
              href={FREE_SCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 text-[11px] tracking-[0.25em] font-medium bg-white text-[#0a0a0a] hover:bg-transparent hover:text-[var(--color-text)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] transition-all duration-300"
            >
              {CONTACT_CTA_LABEL} &nbsp;&rarr;
            </a>
          </motion.div>

          {/* Right */}
          <motion.div className="max-w-sm" variants={fadeUp}>
            <p className="text-base leading-[1.8] text-[var(--color-text-muted)] mb-6">
              {CONTACT_BODY}
            </p>
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="text-sm tracking-[0.15em] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors uppercase"
            >
              {SITE_EMAIL.toUpperCase()}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

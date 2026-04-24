"use client";

import { motion } from "framer-motion";
import { industries } from "@/content/industries";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

export default function IndustrySection() {
  return (
    <section id="industry" className="relative">
      {/* Header — uses theme colors */}
      <motion.div
        className="theme-section px-[clamp(40px,6vw,100px)] pt-[clamp(60px,8vh,120px)] pb-[clamp(40px,5vh,80px)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.span
          className="block text-[11px] font-semibold tracking-[0.22em] text-[var(--color-text-muted)] uppercase mb-2.5"
          variants={fadeUp}
        >
          INDUSTRIES
        </motion.span>
        <motion.h2
          className="text-[clamp(36px,5vw,72px)] font-bold leading-[1.05] text-[var(--color-text)]"
          variants={fadeUp}
        >
          Built For
          <br />
          Your Industry
        </motion.h2>
      </motion.div>

      {/* Stacked sticky cards — always dark (images need dark overlay) */}
      <div className="relative">
        {industries.map((ind, i) => (
          <div
            key={i}
            className="sticky top-0 w-full h-screen overflow-hidden"
            style={{ zIndex: i + 1 }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-[1.06]"
              style={{ backgroundImage: `url('${ind.image}')` }}
            />

            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.18) 100%)",
              }}
            />

            {/* Full card click area */}
            <a
              href={ind.link}
              className="absolute inset-0 z-10"
              aria-label={`${ind.name} — View details`}
            />

            {/* Content — always white text */}
            <div className="absolute inset-0 flex flex-col text-white px-[clamp(40px,6vw,80px)] py-[clamp(40px,6vh,70px)]">
              {/* Top */}
              <div className="flex flex-col gap-2">
                <span className="text-[clamp(16px,1.6vw,26px)] font-medium tracking-[0.04em] uppercase opacity-70">
                  {ind.num}
                </span>
                <h3 className="text-[clamp(36px,5vw,72px)] font-bold leading-[1.1]">
                  {ind.name}
                </h3>
                <span className="relative z-[11] inline-block mt-4 px-[22px] py-2.5 text-[11px] tracking-[2.5px] font-medium uppercase text-white hover:bg-white hover:text-[#0a0a0a] transition-all duration-200 self-start">
                  View Example &rarr;
                </span>
              </div>

              {/* Bottom */}
              <div className="mt-auto pt-10">
                <p className="text-[clamp(15px,1.4vw,18px)] leading-[1.8] text-white/80 mb-6 max-w-[560px]">
                  {ind.problem}
                </p>
                <span className="inline-block text-[12px] font-bold tracking-[0.18em] uppercase text-[#0d0d0d] bg-white px-3.5 py-1.5 mb-3.5">
                  {ind.badge}
                </span>
                <p className="text-[clamp(15px,1.4vw,18px)] leading-[1.8] text-white/75 max-w-[560px]">
                  {ind.result}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

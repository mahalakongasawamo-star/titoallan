"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs, faqFilters } from "@/content/faq";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

export default function FAQSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) => activeFilter === "all" || f.stage === activeFilter || f.stage === "all",
  );

  return (
    <section id="faq" className="theme-section relative py-28 sm:py-36">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.span
            className="block text-[10px] tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-4"
            variants={fadeUp}
          >
            COMMON QUESTIONS
          </motion.span>
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] leading-tight"
            variants={fadeUp}
          >
            Everything You
            <br />
            Need To Know
          </motion.h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {faqFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase border transition-all duration-300 ${
                activeFilter === f.value
                  ? "border-[var(--color-text-muted)] text-[var(--color-text)] bg-white/5"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-0">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={`${activeFilter}-${i}`}
                className="border-b border-[var(--color-border)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <div>
                    <span className="block text-[9px] tracking-[0.2em] text-[var(--color-text-subtle)] uppercase mb-2">
                      {faq.stageTag}
                    </span>
                    <span className="text-base text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <span className="ml-4 shrink-0 text-[var(--color-text-subtle)]">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-[1.8] text-[var(--color-text-muted)] max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-8">
          <span className="text-sm text-[var(--color-text-muted)]">
            Still have a question not listed here?
          </span>
          <a
            href="mailto:hello@upserv.ai"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Ask Us Directly &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

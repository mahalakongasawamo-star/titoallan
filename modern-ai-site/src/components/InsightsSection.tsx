"use client";

import { motion } from "framer-motion";
import { articles, featuredArticle, featuredLearnings } from "@/content/insights";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

export default function InsightsSection() {
  return (
    <section id="insights" className="theme-section relative py-28 sm:py-36">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.15 }}
        >
          <div>
            <motion.span
              className="block text-[10px] tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-4"
              variants={fadeUp}
            >
              AI INSIGHTS
            </motion.span>
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] leading-tight mb-4"
              variants={fadeUp}
            >
              Know What AI
              <br />
              Knows About You.
            </motion.h2>
            <motion.p
              className="text-sm leading-[1.8] text-[var(--color-text-muted)] max-w-lg"
              variants={fadeUp}
            >
              Plain-language articles on AI visibility, schema markup, training
              documents, and how small businesses get recommended by ChatGPT,
              Gemini, and Perplexity.
            </motion.p>
          </div>
          <motion.a
            href="mailto:hello@upserv.ai"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors whitespace-nowrap"
            variants={fadeUp}
          >
            Get notified when we publish &rarr;
          </motion.a>
        </motion.div>

        {/* Featured */}
        <motion.div
          className="border border-[var(--color-border)] p-8 sm:p-10 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="flex gap-4 text-[9px] tracking-[0.2em] text-[var(--color-text-subtle)] uppercase mb-4">
            <span>FEATURED — {featuredArticle.date}</span>
            <span>{featuredArticle.time}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] leading-snug mb-4">
            {featuredArticle.title}
          </h3>
          <p className="text-sm leading-[1.8] text-[var(--color-text-muted)] mb-6 max-w-2xl">
            {featuredArticle.description}
          </p>
          <p className="text-xs text-[var(--color-text-subtle)] mb-6">By Upserv</p>

          <div className="mb-6">
            <span className="text-[9px] tracking-[0.15em] text-[var(--color-text-subtle)] uppercase block mb-3">
              WHAT YOU WILL LEARN
            </span>
            <ul className="space-y-1.5 text-sm text-[var(--color-text-muted)]">
              {featuredLearnings.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {(featuredArticle.tags ?? []).map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[9px] tracking-[0.1em] text-[var(--color-text-subtle)] border border-[var(--color-border)]"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </motion.div>

        {/* Article grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          {articles.map((a, i) => (
            <motion.article
              key={i}
              className="group border border-[var(--color-border)] p-6 hover:border-[var(--color-text-subtle)] transition-colors duration-500"
              variants={fadeUp}
            >
              <div className="flex gap-3 text-[9px] tracking-[0.15em] text-[var(--color-text-subtle)] uppercase mb-4">
                <span>{a.date}</span>
                <span>{a.time}</span>
              </div>
              <h4 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors leading-snug mb-4">
                {a.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(a.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[8px] tracking-[0.1em] text-[var(--color-text-subtle)] border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter */}
        <div className="text-center border-t border-[var(--color-border)] pt-10">
          <p className="text-sm text-[var(--color-text-muted)] mb-4 max-w-lg mx-auto">
            One email per month. No fluff. Only fact-based updates on AI search
            changes that affect your business.
          </p>
          <a
            href="mailto:hello@upserv.ai"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Subscribe &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

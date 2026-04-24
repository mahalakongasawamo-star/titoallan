"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONTENT } from "./content";

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

function WhispersCard({
  card,
  index,
}: {
  card: { title: string; description: string; image: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.8, ease: EASING }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${card.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rr-cobalt/60 via-transparent to-transparent" />
      </div>

      {/* Text */}
      <div className="mt-6 md:mt-8">
        <h4 className="text-sm md:text-base tracking-[0.2em] font-light text-white">
          {card.title}
        </h4>
        <p className="text-sm font-light text-white/50 mt-3 leading-relaxed">
          {card.description}
        </p>
        <div className="mt-4">
          <span className="group/link inline-flex items-center gap-3 text-[10px] tracking-[0.3em] text-rr-gold/70 hover:text-rr-gold transition-colors duration-400">
            DISCOVER
            <span className="inline-block w-5 h-[1px] bg-current transition-all duration-500 group-hover/link:w-8" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WhispersSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="whispers"
      className="relative bg-rr-cobalt py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-rr-black/20 via-transparent to-rr-black/30 pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASING }}
              className="text-[10px] tracking-[0.6em] text-rr-gold/60 mb-4"
            >
              {CONTENT.WHISPERS_SUBTITLE}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: EASING }}
              className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[-0.01em] text-white"
            >
              {CONTENT.WHISPERS_TITLE}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: EASING }}
            className="text-sm font-light text-white/50 max-w-md mt-6 md:mt-0 leading-relaxed"
          >
            {CONTENT.WHISPERS_DESCRIPTION}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-14">
          {CONTENT.WHISPERS_CARDS.map((card, i) => (
            <WhispersCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: EASING }}
          className="text-center mt-16 md:mt-24"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-4 border border-white/20 text-white text-[10px] md:text-[11px] tracking-[0.3em] px-10 md:px-14 py-4 md:py-5 transition-all duration-500 hover:border-rr-gold/40 hover:bg-white/5"
          >
            {CONTENT.WHISPERS_CTA}
            <span className="inline-block w-5 h-[1px] bg-rr-gold transition-all duration-500 group-hover:w-8" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

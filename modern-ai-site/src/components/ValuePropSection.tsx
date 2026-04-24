"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  VALUE_PROP_COUNTER_TARGET,
  VALUE_PROP_BODY,
} from "@/content/value-prop";

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 50, damping: 18 },
  },
};

export default function ValuePropSection() {
  return (
    <section id="explore" className="theme-section relative py-28 sm:py-36">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mb-10"
            variants={fadeUp}
          >
            <AnimatedCounter target={VALUE_PROP_COUNTER_TARGET} /> Million Weekly
            <br />
            ChatGPT Users.
            <br />
            Is Your Data Verified?
          </motion.h2>

          <motion.div className="space-y-5 max-w-2xl" variants={fadeUp}>
            {VALUE_PROP_BODY.map((paragraph, i) => (
              <p key={i} className="text-base leading-[1.9] text-[var(--color-text-muted)]">
                {paragraph}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(target);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          setCount(0);
          const duration = 2500;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setCount(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
    </span>
  );
}

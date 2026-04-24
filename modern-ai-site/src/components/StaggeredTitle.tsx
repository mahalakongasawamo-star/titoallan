"use client";

import { motion } from "framer-motion";

const lines = [
  "Upserv Builds Websites",
  "That Get Your Business",
  "Recommended by AI",
  "Not Just Found by Google.",
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.25 },
  },
};

const word = {
  hidden: { opacity: 0, y: 35, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      mass: 1,
    },
  },
};

export default function StaggeredTitle() {
  return (
    <motion.h1
      className="text-[clamp(2rem,5.5vw,4.5rem)] font-bold tracking-tight leading-[1.06] text-white mb-10"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => (
            <motion.span
              key={`${li}-${wi}`}
              variants={word}
              className="inline-block mr-[0.3em]"
            >
              {w}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

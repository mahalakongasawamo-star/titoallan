'use client';

import { motion } from 'framer-motion';

const lines = [
  'Upserv Builds Websites',
  'That Get Your Business',
  'Recommended by AI',
  'Not Just Found by Google.',
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.25 },
  },
};

const word = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function StaggeredTitle() {
  return (
    <motion.h1
      className="font-serif text-[clamp(32px,4.5vw,72px)] font-bold tracking-tight leading-[1.06] text-white mb-10"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(' ').map((w, wi) => (
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

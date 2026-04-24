"use client";

import { motion } from "framer-motion";

export default function CTAButton() {
  return (
    <div className="relative inline-block">
      {/* Glow pulse — blurred layer behind button */}
      <motion.div
        className="absolute -inset-2 rounded-sm bg-white/15 blur-xl"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.a
        href="#features"
        className="relative inline-block px-10 py-4 text-[11px] tracking-[0.25em] font-medium
                   bg-white text-[#0a0a0a]
                   hover:bg-transparent hover:text-white
                   hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]
                   transition-colors duration-300"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        GET YOUR FREE AI SCAN
      </motion.a>
    </div>
  );
}

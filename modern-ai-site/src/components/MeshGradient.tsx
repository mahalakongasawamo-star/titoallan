"use client";

import { motion } from "framer-motion";

interface Blob {
  color: string;
  size: string;
  position: string;
  animate: { x: number[]; y: number[] };
  duration: number;
}

const blobs: Blob[] = [
  {
    color: "bg-indigo-600/30",
    size: "w-[600px] h-[600px]",
    position: "top-[-10%] left-[-5%]",
    animate: { x: [0, 80, -40, 0], y: [0, -60, 30, 0] },
    duration: 20,
  },
  {
    color: "bg-violet-500/25",
    size: "w-[500px] h-[500px]",
    position: "top-[20%] right-[-8%]",
    animate: { x: [0, -60, 40, 0], y: [0, 50, -30, 0] },
    duration: 24,
  },
  {
    color: "bg-fuchsia-600/20",
    size: "w-[550px] h-[550px]",
    position: "bottom-[-5%] left-[25%]",
    animate: { x: [0, 50, -70, 0], y: [0, -40, 60, 0] },
    duration: 22,
  },
  {
    color: "bg-cyan-500/15",
    size: "w-[450px] h-[450px]",
    position: "bottom-[15%] right-[10%]",
    animate: { x: [0, -40, 60, 0], y: [0, 70, -50, 0] },
    duration: 26,
  },
];

export default function MeshGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[120px] ${blob.color} ${blob.size} ${blob.position}`}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

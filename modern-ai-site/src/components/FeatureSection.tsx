"use client";

import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";

import { features } from "@/content/features";

const FeatureCanvas = lazy(() => import("./FeatureCanvas"));

const textFadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 60, damping: 18 },
  },
};

export default function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [opacityProgress, setOpacityProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* GSAP ScrollTrigger — register inside effect to avoid SSR crash */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let trigger: { kill: () => void } | null = null;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self: { progress: number }) => {
          setRotationProgress(self.progress);
          setOpacityProgress(Math.min(self.progress / 0.6, 1));
        },
      });
    })();

    return () => {
      trigger?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen py-24 sm:py-32 overflow-hidden bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.span
              className="block text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4"
              variants={textFadeUp}
            >
              WHY UPSERV
            </motion.span>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-12"
              variants={textFadeUp}
            >
              Built for the
              <br />
              <span className="text-violet-400">AI&nbsp;era.</span>
            </motion.h2>

            <div className="space-y-10">
              {features.map((f, i) => (
                <motion.div key={i} variants={textFadeUp}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-[1.8] text-white/60">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — 3D Torus (desktop) / Gradient orb (mobile) */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
            {!mounted ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-violet-500/10 blur-[80px]" />
              </div>
            ) : isMobile ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-cyan-400/10 blur-[60px]" />
              </motion.div>
            ) : (
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-violet-500/10 blur-[80px] animate-pulse" />
                  </div>
                }
              >
                <FeatureCanvas
                  rotationProgress={rotationProgress}
                  opacityProgress={opacityProgress}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

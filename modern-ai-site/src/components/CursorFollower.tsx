"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.5 };

export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /* Spring-smoothed values for the lag effect */
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  useEffect(() => {
    /* Disable entirely on touch / coarse-pointer devices for 60fps */
    const mq = window.matchMedia("(pointer: coarse)");
    if (mq.matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(true);
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setIsHovering(false);
      }
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  /* Don't render on mobile/touch */
  if (isTouchDevice) return null;

  const size = isHovering ? 60 : 20;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
      style={{
        x: springX,
        y: springY,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: isHovering
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.6)",
        filter: isHovering ? "blur(0px)" : "blur(4px)",
        mixBlendMode: isHovering ? "difference" : "normal",
        opacity: isVisible ? 1 : 0,
      }}
      animate={{
        width: size,
        height: size,
        filter: isHovering ? "blur(0px)" : "blur(4px)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
    />
  );
}

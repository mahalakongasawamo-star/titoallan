import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING = { stiffness: 150, damping: 15, mass: 0.5 };

export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); setIsVisible(true); };
    const onOver = (e) => { if (e.target.closest('a, button, [role="button"]')) setIsHovering(true); };
    const onOut = (e) => { if (e.target.closest('a, button, [role="button"]')) setIsHovering(false); };
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  const size = isHovering ? 60 : 20;

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999,
        pointerEvents: 'none', borderRadius: '50%',
        x: springX, y: springY,
        width: size, height: size,
        translateX: '-50%', translateY: '-50%',
        backgroundColor: isHovering ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
        filter: isHovering ? 'blur(0px)' : 'blur(4px)',
        mixBlendMode: isHovering ? 'difference' : 'normal',
        opacity: isVisible ? 1 : 0,
      }}
      animate={{ width: size, height: size, filter: isHovering ? 'blur(0px)' : 'blur(4px)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.8 }}
    />
  );
}

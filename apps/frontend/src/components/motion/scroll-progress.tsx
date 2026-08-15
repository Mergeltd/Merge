"use client";

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient progress bar pinned under the header, tracking page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400"
    />
  );
}

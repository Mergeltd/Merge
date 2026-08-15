"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  gradientWords?: string[];
  delay?: number;
}

const container = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.055, delayChildren: delay },
  }),
};

const word = {
  hidden: { opacity: 0, y: '0.6em', filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Splits text into words and reveals them with a staggered blur/slide entrance. Words in `gradientWords` get the brand gradient treatment. */
export function AnimatedHeading({ text, className, gradientWords = [], delay = 0 }: AnimatedHeadingProps) {
  const words = text.split(' ');

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={className}
    >
      {words.map((w, i) => {
        const isGradient = gradientWords.some((g) => w.replace(/[^\w&]/g, '') === g);
        return (
          <motion.span
            key={`${w}-${i}`}
            variants={word}
            className={cn('inline-block mr-[0.28em]', isGradient && 'text-gradient')}
          >
            {w}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}

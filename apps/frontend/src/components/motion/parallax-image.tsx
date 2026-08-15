"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  range?: number;
  sizes?: string;
  priority?: boolean;
}

/** A `fill` image inside an overflow-hidden box that drifts vertically as the page scrolls past it. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  range = 60,
  sizes = '100vw',
  priority,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }} className="absolute inset-[-8%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', imgClassName)}
        />
      </motion.div>
    </div>
  );
}

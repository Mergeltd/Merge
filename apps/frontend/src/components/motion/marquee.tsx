import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}

/** Infinite horizontal scroller. Pure CSS (animate-marquee), duplicated content for a seamless loop. */
export function Marquee({ children, className, reverse = false }: MarqueeProps) {
  return (
    <div className={cn('group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center gap-12 animate-marquee group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-center gap-12 animate-marquee group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]'
        )}
      >
        {children}
      </div>
    </div>
  );
}

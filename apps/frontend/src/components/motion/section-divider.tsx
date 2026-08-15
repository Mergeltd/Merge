import { cn } from '@/lib/utils';

interface SectionDividerProps {
  /** Fill color of the wave, e.g. "fill-slate-50" or "fill-slate-900" */
  className?: string;
  flip?: boolean;
}

/** Thin SVG wave used to morph the seam between two stacked sections. */
export function SectionDivider({ className, flip = false }: SectionDividerProps) {
  return (
    <div aria-hidden className={cn('relative h-12 sm:h-16 w-full overflow-hidden leading-[0]', flip && 'rotate-180')}>
      <svg
        className={cn('relative block w-full h-full', className)}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,32 C300,90 900,-10 1200,48 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}

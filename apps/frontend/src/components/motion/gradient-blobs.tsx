import { cn } from '@/lib/utils';

interface GradientBlobsProps {
  className?: string;
  variant?: 'dark' | 'light';
}

/**
 * Decorative, pure-CSS morphing blob field. No JS needed — the border-radius
 * and transform keyframes (see tailwind.config.ts `blob`/`float`) do the work,
 * so this renders happily from a server component.
 */
export function GradientBlobs({ className, variant = 'dark' }: GradientBlobsProps) {
  const palette =
    variant === 'dark'
      ? ['bg-indigo-500/30', 'bg-violet-500/20', 'bg-sky-400/20']
      : ['bg-indigo-300/40', 'bg-violet-300/30', 'bg-sky-300/30'];

  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div
        className={cn(
          'absolute -top-24 -left-24 w-[28rem] h-[28rem] blur-3xl animate-blob',
          palette[0]
        )}
      />
      <div
        className={cn(
          'absolute top-1/3 -right-24 w-[24rem] h-[24rem] blur-3xl animate-blob',
          palette[1]
        )}
        style={{ animationDelay: '-4s' }}
      />
      <div
        className={cn(
          'absolute -bottom-32 left-1/4 w-[26rem] h-[26rem] blur-3xl animate-blob',
          palette[2]
        )}
        style={{ animationDelay: '-8s' }}
      />
    </div>
  );
}

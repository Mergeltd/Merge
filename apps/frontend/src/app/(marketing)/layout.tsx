import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ScrollProgress } from '@/components/motion/scroll-progress';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <SiteHeader />
      <div className="flex-1 min-w-0">{children}</div>
      <SiteFooter />
    </div>
  );
}

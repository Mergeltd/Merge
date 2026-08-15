import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = 'MERGE';
const siteDescription =
  'MERGE connects residents, property managers, landlords, and verified local technicians in one AI-powered property management and maintenance marketplace.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MERGE | Property Management & Maintenance Marketplace',
    template: '%s | MERGE',
  },
  description: siteDescription,
  keywords: [
    'property management software',
    'maintenance marketplace',
    'technician marketplace',
    'landlord software',
    'rental vacancy listings',
    'building maintenance app',
  ],
  applicationName: siteName,
  authors: [{ name: 'MERGE' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: 'MERGE | Property Management & Maintenance Marketplace',
    description: siteDescription,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MERGE | Property Management & Maintenance Marketplace',
    description: siteDescription,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="bg-white text-slate-900 font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

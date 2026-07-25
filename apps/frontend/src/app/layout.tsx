import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import QueryProvider from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'MERGE Platform',
  description: 'Smart Real Estate Management & Maintenance Ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import PageLayout from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'BHK SEO Tools - AI-Powered SEO Analysis',
  description: 'Elevate Your SEO with AI-Powered Insights and Optimization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased flex flex-col min-h-screen')}>
        <PageLayout>
          {children}
        </PageLayout>
        <Toaster />
      </body>
    </html>
  );
}

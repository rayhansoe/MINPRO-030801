import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import React from 'react';
import { ThemeProvider } from '@/components/shared/navbar/theme-provider';
import SiteHeader from '@/components/shared/navbar/site-header';
import { TailwindIndicator } from '@/components/shared/navbar/tailwind-indicator';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'AI Code Reviewer — Instant Bug Detection & Code Optimization',
  description:
    'Upload your code and get instant AI-powered reviews: bugs, optimizations, and best practices with corrected code.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        {/* Ambient background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>

        {/* Dot grid overlay */}
        <div className="dot-grid" />

        {/* Noise texture */}
        <div className="noise-overlay" />

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>

          {/* Footer */}
          <footer className="relative mt-16 py-6 text-center border-t border-[var(--color-border-subtle)]">
            <div className="footer-gradient absolute inset-x-0 -top-16 h-16 pointer-events-none" />
            <p className="text-xs text-[var(--color-text-muted)] tracking-wide">
              Built with{' '}
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent font-medium">
                AI Code Reviewer
              </span>
              {' '}· Powered by OpenRouter
            </p>
          </footer>
        </div>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

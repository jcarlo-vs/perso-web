import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { NoiseOverlay } from '@/components/ui/noise-overlay';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Juan Carlo Senin | Full Stack Developer',
  description:
    'Portfolio of Juan Carlo Senin - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.',
  keywords: [
    'Juan Carlo Senin',
    'Full Stack Developer',
    'React',
    'Next.js',
    'Node.js',
    'Web Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Juan Carlo Senin' }],
  openGraph: {
    title: 'Juan Carlo Senin | Full Stack Developer',
    description: 'Portfolio of Juan Carlo Senin - Full Stack Developer',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}

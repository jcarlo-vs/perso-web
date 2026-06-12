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
  metadataBase: new URL('https://jcvs-codes.com'),
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Juan Carlo Senin | Full Stack Developer',
    description: 'Portfolio of Juan Carlo Senin - Full Stack Developer',
    type: 'website',
    url: 'https://jcvs-codes.com',
    siteName: 'Juan Carlo Senin',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Juan Carlo Senin - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Carlo Senin | Full Stack Developer',
    description: 'Portfolio of Juan Carlo Senin - Full Stack Developer',
    images: ['/og-image.png'],
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

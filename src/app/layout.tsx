import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Subhojit Das — Creative Direction, 3D LookDev & Motion Systems',
  description:
    'Independent portfolio of Subhojit Das showcasing oversized 3D visualization, cinematic motion direction, and architectural graphic design systems.',
  keywords: [
    '3D Visualization',
    'LookDev',
    'Cinema 4D',
    'Octane Render',
    'Blender 3D',
    'Motion Design',
    'Arri Alexa',
    'Editorial Design',
    'Swiss Typography',
  ],
  authors: [{ name: 'Subhojit Das' }],
  openGraph: {
    title: 'Subhojit Das — Creative Direction & 3D Visualization',
    description:
      'Translating bold concepts into tangible spatial realities, cinematic motion, and editorial design systems.',
    url: 'https://subhojitdas.design',
    siteName: 'Subhojit Das Portfolio',
    images: [
      {
        url: '/portfolio/3d/monolith-titanium.svg',
        width: 1920,
        height: 1080,
        alt: 'Subhojit Das Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen studio-texture-bg text-studio-900 antialiased selection:bg-coral-500 selection:text-white flex flex-col justify-between relative">
        {/* Tactile micro-grain overlay */}
        <div className="fixed inset-0 grain-overlay pointer-events-none z-50 opacity-40" />

        <Suspense fallback={<div className="h-20" />}>
          <Navigation />
        </Suspense>

        <main className="flex-grow relative z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}


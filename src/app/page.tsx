import { Suspense } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import ProjectGallery from '@/components/ProjectGallery';
import PhilosophySection from '@/components/PhilosophySection';
import { getProjects } from '@/lib/projects-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Dynamic on request for instant updates

export default async function HomePage() {
  const projects = await getProjects({ includeUnpublished: false });

  return (
    <div className="relative">
      {/* 3D Floating Perspective Hero Carousel */}
      <HeroCarousel projects={projects} />

      {/* Filterable Project Gallery */}
      <Suspense fallback={<div className="py-24 text-center text-zinc-500 font-mono text-xs">Loading Curated Archive...</div>}>
        <ProjectGallery initialProjects={projects} />
      </Suspense>

      {/* Editorial Philosophy & Disciplines Breakdown */}
      <PhilosophySection />
    </div>
  );
}


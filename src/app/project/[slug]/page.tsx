import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Calendar, User, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/lib/projects-service';
import ProjectDetailClient from './ProjectDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found — Subhojit Das',
    };
  }

  return {
    title: `${project.title} — Subhojit Das`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Subhojit Das`,
      description: project.description,
      images: [{ url: project.hero_media_url || project.thumbnail_url }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  // Get all projects to find next and previous
  const allProjects = await getProjects({ includeUnpublished: false });
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);

  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}


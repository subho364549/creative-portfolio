'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Eye, VolumeX } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideoPreview = Boolean(project.video_preview_url || project.hero_media_type === 'video');
  const videoSrc = project.video_preview_url || project.hero_media_url;

  // IntersectionObserver to observe when card is on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Play / pause video on hover when in view
  useEffect(() => {
    if (!videoRef.current || !hasVideoPreview) return;

    if (isHovered && isInView) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isInView, hasVideoPreview]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/85 border border-black/5 hover:border-coral-500/40 transition-all duration-500 shadow-md hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1.5"
    >
      <Link href={`/project/${project.slug}`} className="flex flex-col h-full">
        {/* Media Thumbnail Container with 16:10 aspect ratio */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-studio-950 rounded-t-3xl">
          {/* Main Media */}
          {hasVideoPreview ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={videoSrc}
                poster={project.thumbnail_url}
                muted
                loop
                playsInline
                preload="none"
                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? 'opacity-100' : 'opacity-90'
                }`}
              />

              {/* Video Badge */}
              <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-white flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <Play className="w-2.5 h-2.5 fill-coral-500 text-coral-500" />
                <span>PREVIEW</span>
              </div>
            </div>
          ) : (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-95 group-hover:opacity-100"
            />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-studio-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Pill Tag with Coral Accent */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/5 text-[11px] font-mono font-bold tracking-wider text-studio-900 uppercase shadow-sm">
              {project.category}
            </span>
          </div>

          {/* Hover View Cue */}
          <div className="absolute bottom-4 right-4 z-10 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="w-10 h-10 rounded-full bg-studio-900 group-hover:bg-coral-500 text-white flex items-center justify-center shadow-lg transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Editorial Information Block */}
        <div className="p-6 flex flex-col justify-between flex-grow bg-white/80">
          <div>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-2">
              <span className="uppercase tracking-wider">{project.client || 'COMMISSIONED WORK'}</span>
              <span>{project.year}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-studio-900 group-hover:text-coral-500 transition-colors leading-snug">
              {project.title}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tools / Software Tags */}
          {project.tools && project.tools.length > 0 && (
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-1.5">
              {project.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/60"
                >
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="px-1.5 py-1 text-[10px] font-mono text-slate-400">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

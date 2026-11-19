'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowUpRight,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Calendar,
  User,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Project, MediaItem } from '@/lib/types';

interface ProjectDetailClientProps {
  project: Project;
  prevProject?: Project;
  nextProject?: Project;
}

interface LightboxItem {
  url: string;
  type: 'image' | 'video';
  caption?: string;
  poster?: string;
}

export default function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Keyboard Escape listener to close full frame modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // GSAP page enter animation
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [project.slug]);

  const togglePlay = () => {
    if (!heroVideoRef.current) return;
    if (isPlaying) {
      heroVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      heroVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const isVideo = project.hero_media_type === 'video' || Boolean(project.video_preview_url);
  const videoSource = project.video_preview_url || project.hero_media_url;

  return (
    <article className="min-h-screen pt-24 pb-32 text-studio-900">
      {/* Universal Fullscreen / Lightbox Modal (Supports Image & Video) */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-fade-in"
        >
          {/* Top Control Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between pb-3 mb-3 border-b border-white/10 z-10 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="uppercase tracking-wider text-white font-semibold">{project.title}</span>
              {lightboxItem.caption && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-300">{lightboxItem.caption}</span>
                </>
              )}
            </div>

            <button
              onClick={() => setLightboxItem(null)}
              className="p-2 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 text-xs font-mono transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-4 h-4" />
              <span>CLOSE [ESC]</span>
            </button>
          </div>

          {/* Media Content Display */}
          <div
            className="relative max-w-6xl max-h-[82vh] w-full flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.type === 'video' ||
            lightboxItem.url.endsWith('.mp4') ||
            lightboxItem.url.endsWith('.webm') ? (
              <video
                src={lightboxItem.url}
                poster={lightboxItem.poster}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl bg-black border border-white/15 outline-none"
              />
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.caption || 'Enlarged project media'}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            )}
          </div>

          {lightboxItem.caption && (
            <p
              className="mt-3 text-xs font-mono text-zinc-400 text-center max-w-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.caption}
            </p>
          )}
        </div>
      )}

      <div ref={contentRef} className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Back navigation & Category breadcrumb */}
        <div className="py-6 flex items-center justify-between border-b border-black/10">
          <Link
            href={`/?category=${project.category}#work-gallery`}
            className="inline-flex items-center gap-2 text-xs font-mono text-studio-600 hover:text-coral-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO ARCHIVE ({project.category.toUpperCase()})</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-studio-500">
            <span className="uppercase font-semibold text-studio-900">{project.category}</span>
            <span>/</span>
            <span>{project.year}</span>
          </div>
        </div>

        {/* Project Header Info */}
        <div className="pt-10 pb-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 text-[11px] font-mono text-studio-600 uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
            <span>COMMISSIONED CASE STUDY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest text-studio-950 leading-[1.05]">
            {project.title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-studio-700 leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        {/* Hero Media Composition (Oversized) */}
        <div className="relative w-full rounded-3xl overflow-hidden sculpted-plate border border-black/5 shadow-2xl bg-studio-950 aspect-[16/9] sm:aspect-[21/9] my-6 group">
          {isVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={heroVideoRef}
                src={videoSource}
                poster={project.thumbnail_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Video Controls Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-xs text-zinc-300 hidden sm:inline">
                    {project.title} • 4K Master
                  </span>
                </div>

                <button
                  onClick={() =>
                    setLightboxItem({
                      url: videoSource,
                      type: 'video',
                      caption: `${project.title} • Master 4K Video`,
                      poster: project.thumbnail_url,
                    })
                  }
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={project.hero_media_url || project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  setLightboxItem({
                    url: project.hero_media_url || project.thumbnail_url,
                    type: 'image',
                    caption: `${project.title} • Key Visual`,
                  })
                }
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Expand image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-y border-black/10 my-10 font-mono text-xs">
          <div>
            <span className="text-studio-500 uppercase tracking-widest block mb-1">
              // CLIENT / PATRON
            </span>
            <span className="text-studio-950 font-semibold text-sm">
              {project.client || 'Self-Directed Exploration'}
            </span>
          </div>

          <div>
            <span className="text-studio-500 uppercase tracking-widest block mb-1">
              // YEAR OF RELEASE
            </span>
            <span className="text-studio-950 font-semibold text-sm">
              {project.year}
            </span>
          </div>

          <div>
            <span className="text-studio-500 uppercase tracking-widest block mb-1">
              // DISCIPLINE & ROLE
            </span>
            <span className="text-studio-950 font-semibold text-sm">
              {project.role || 'Lead Creative Director'}
            </span>
          </div>

          <div>
            <span className="text-studio-500 uppercase tracking-widest block mb-1">
              // CATEGORY CODE
            </span>
            <span className="text-coral-500 font-semibold text-sm uppercase">
              {project.category} / ARCHIVE
            </span>
          </div>
        </div>

        {/* Case Study Content & Tools Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-8">
          {/* Main Narrative Column */}
          <div className="lg:col-span-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-coral-500 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              <span>PROJECT OVERVIEW & EXECUTION</span>
            </h2>

            <div className="max-w-none text-studio-700 font-sans leading-relaxed text-base space-y-6">
              {project.content ? (
                <div
                  className="space-y-6 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: project.content
                      .replace(/^# (.*$)/gim, '<h3 class="text-2xl font-bold text-studio-950 mt-6 mb-3">$1</h3>')
                      .replace(/^### (.*$)/gim, '<h4 class="text-lg font-semibold text-studio-900 mt-4 mb-2">$1</h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-studio-950 font-semibold">$1</strong>'),
                  }}
                />
              ) : (
                <p>{project.description}</p>
              )}
            </div>
          </div>

          {/* Tools & Specifications Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/70 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-studio-500">
                SOFTWARE & HARDWARE PIPELINE
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools && project.tools.length > 0 ? (
                  project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 rounded-xl bg-white border border-black/5 text-xs font-mono text-studio-800 shadow-sm"
                    >
                      {tool}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-studio-500 font-mono">Bespoke Studio Pipeline</span>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/70 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-studio-500">
                DIRECT INQUIRY & COMMISSIONS
              </h3>
              <p className="text-xs text-studio-600 leading-relaxed font-sans">
                Interested in commissioning similar aesthetic pipelines, procedural assets, or film sequences?
              </p>
              <a
                href="mailto:sd4507997@gmail.com"
                className="mt-3 w-full py-3 rounded-2xl bg-studio-900 hover:bg-coral-500 text-white font-semibold text-xs font-mono text-center block transition-all shadow-md hover:shadow-coral-500/20"
              >
                EMAIL INQUIRY (sd4507997@gmail.com)
              </a>
            </div>
          </div>
        </div>

        {/* Supporting Media Gallery (Multi-asset showcase) */}
        {project.media_items && project.media_items.length > 0 && (
          <div className="mt-16 pt-16 border-t border-black/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-coral-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
                  VISUAL ASSETS
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-studio-950 mt-1">
                  Exhibition & Process Frames
                </h3>
              </div>
              <span className="font-mono text-xs text-studio-500 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-sm">
                {project.media_items.length} Supporting Plates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.media_items.map((media, idx) => {
                const isMediaVideo =
                  media.type === 'video' ||
                  media.url.endsWith('.mp4') ||
                  media.url.endsWith('.webm');

                return (
                  <div
                    key={media.id || idx}
                    className="group rounded-3xl overflow-hidden sculpted-plate border border-black/5 bg-white/85 flex flex-col hover:border-coral-500/40 transition-all shadow-md hover:shadow-xl"
                  >
                    <div
                      onClick={() =>
                        setLightboxItem({
                          url: media.url,
                          type: isMediaVideo ? 'video' : 'image',
                          caption: media.caption || `Supporting Plate ${idx + 1}`,
                          poster: media.poster_url || project.thumbnail_url,
                        })
                      }
                      className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer group/plate bg-black"
                      title={isMediaVideo ? 'Click to open video in full frame' : 'Click to enlarge'}
                    >
                      {isMediaVideo ? (
                        <div className="relative w-full h-full">
                          <video
                            src={media.url}
                            poster={media.poster_url || project.thumbnail_url}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white flex items-center gap-1.5">
                            <Play className="w-2.5 h-2.5 fill-coral-500 text-coral-500" />
                            <span>VIDEO</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={media.caption || `Asset ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Fullscreen Expand Cue */}
                      <div className="absolute bottom-3 right-3 p-2 px-3 rounded-full bg-black/80 backdrop-blur-md text-white opacity-90 group-hover/plate:opacity-100 group-hover/plate:bg-coral-500 transition-all flex items-center gap-1.5 text-xs font-mono shadow-lg border border-white/10">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">
                          {isMediaVideo ? 'FULLSCREEN VIDEO' : 'EXPAND'}
                        </span>
                      </div>
                    </div>

                    {media.caption && (
                      <div className="p-4 border-t border-black/5 font-mono text-xs text-studio-600 bg-white/50">
                        {media.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Next / Previous Project Navigation */}
        <div className="mt-24 pt-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevProject ? (
            <Link
              href={`/project/${prevProject.slug}`}
              className="flex items-center gap-4 p-5 rounded-3xl sculpted-plate border border-black/5 bg-white/80 hover:border-coral-500/40 hover:bg-white transition-all w-full sm:w-1/2 group shadow-sm hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-studio-100 flex items-center justify-center shrink-0 group-hover:bg-coral-500 group-hover:text-white transition-all text-studio-800">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-studio-500 uppercase block">
                  PREVIOUS WORK
                </span>
                <span className="text-sm font-bold text-studio-950 truncate block group-hover:text-coral-500 transition-colors">
                  {prevProject.title}
                </span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              href={`/project/${nextProject.slug}`}
              className="flex items-center justify-end gap-4 p-5 rounded-3xl sculpted-plate border border-black/5 bg-white/80 hover:border-coral-500/40 hover:bg-white transition-all w-full sm:w-1/2 group text-right shadow-sm hover:shadow-md"
            >
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-studio-500 uppercase block">
                  NEXT WORK
                </span>
                <span className="text-sm font-bold text-studio-950 truncate block group-hover:text-coral-500 transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-studio-100 flex items-center justify-center shrink-0 group-hover:bg-coral-500 group-hover:text-white transition-all text-studio-800">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </article>
  );
}


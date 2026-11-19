'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Play,
  Pause,
  Sliders,
  VolumeX,
  Sparkles,
  MoveHorizontal,
  Flame,
  Zap,
  Star
} from 'lucide-react';
import { Project } from '@/lib/types';

interface HeroCarouselProps {
  projects: Project[];
}

export default function HeroCarousel({ projects }: HeroCarouselProps) {
  const router = useRouter();

  // If no projects provided or hero projects empty, fallback
  const heroProjects = projects.filter((p) => p.show_in_hero);
  const items = heroProjects.length >= 3 ? heroProjects : projects.slice(0, 5);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDeltaX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Check system prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }
  }, []);

  const total = items.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isDragging || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, isDragging, total, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Handle active video playback
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  // GSAP 3D Layered Carousel Animation
  useEffect(() => {
    if (total === 0) return;

    items.forEach((_, index) => {
      const card = cardRefs.current[index];
      if (!card) return;

      let diff = index - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      const isCurrent = diff === 0;
      const isNeighbor = Math.abs(diff) === 1;

      if (reducedMotion) {
        gsap.to(card, {
          xPercent: diff * 105,
          scale: isCurrent ? 1 : 0.88,
          opacity: isCurrent ? 1 : isNeighbor ? 0.35 : 0,
          rotationY: 0,
          zIndex: isCurrent ? 30 : 20 - Math.abs(diff),
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        const xOffset = diff * 380;
        const rotY = diff * -7;
        const scale = isCurrent ? 1 : 0.84;
        const zDepth = isCurrent ? 60 : -120 * Math.abs(diff);
        const opacity = isCurrent ? 1 : isNeighbor ? 0.75 : 0.25;

        gsap.to(card, {
          x: xOffset,
          z: zDepth,
          rotationY: rotY,
          rotationZ: diff * -1.5,
          scale: scale,
          opacity: opacity,
          zIndex: 50 - Math.abs(diff) * 10,
          duration: 0.85,
          ease: 'power3.out',
        });
      }
    });
  }, [activeIndex, items, reducedMotion, total]);

  // Drag and swipe handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 60;
    if (dragDeltaX.current < -threshold) {
      nextSlide();
    } else if (dragDeltaX.current > threshold) {
      prevSlide();
    }
    dragDeltaX.current = 0;
  };

  const currentProject = items[activeIndex] || items[0];

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Sculpted Clay Organic Backdrop Plate (Inspired by Skot. design) */}
      <div className="absolute top-36 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl h-[580px] sm:h-[640px] lg:h-[700px] rounded-[3rem] sm:rounded-[4rem] sculpted-plate pointer-events-none -z-0 opacity-80" />

      {/* Decorative Organic Accent Pill on right */}
      <div className="absolute top-28 right-6 lg:right-16 w-72 h-96 rounded-[3.5rem] bg-gradient-to-br from-slate-200/50 to-transparent pointer-events-none -z-0 blur-sm" />

      {/* Hero Intro Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full z-10 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div className="max-w-3xl">
            {/* Top pill badge with coral dot */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/5 text-xs font-semibold text-slate-700 mb-4 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
              <span>3D Modeling Artist // Video Editor // Graphic Designer</span>
            </div>

            {/* Large Bold Editorial Headline with Emojis / Accents like reference */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest text-studio-900 leading-[1.05]">
              VISUALS WITH A <br className="hidden sm:inline" />
              POINT OF VIEW<span className="text-coral-500">.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              I'm a creative enthusiast working across video editing, 3D art and graphic design. I love playing with visuals, experimenting with ideas and turning simple concepts into something worth looking at. Sometimes it's a frame, sometimes a 3D world, sometimes just a design that catches the eye.
            </p>
          </div>

          {/* Social Proof / Recognition Badge (Inspired by top right of Skot. reference) */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-3 p-2 px-3.5 rounded-2xl bg-white/80 border border-black/5 shadow-sm backdrop-blur-md">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                  3D
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-coral-500 text-[10px] font-bold text-white flex items-center justify-center">
                  FX
                </div>
                <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-700 text-[10px] font-bold text-white flex items-center justify-center">
                  UE5
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-studio-900 leading-tight">
                  2+ Years Experience
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-mono">
                  <span>★★★★★</span>
                  <span className="text-slate-500 text-[9px]">40+ Projects</span>
                </div>
              </div>
            </div>

            {/* Quick Category Jump Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <button
                onClick={() => router.push('/?category=3d#work-gallery')}
                className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-studio-900 hover:text-white border border-black/5 text-slate-700 transition-all flex items-center gap-1.5 shadow-sm group"
              >
                <span>3D CGI</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-coral-500 transition-colors" />
              </button>
              <button
                onClick={() => router.push('/?category=video#work-gallery')}
                className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-studio-900 hover:text-white border border-black/5 text-slate-700 transition-all flex items-center gap-1.5 shadow-sm group"
              >
                <span>Motion</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-coral-500 transition-colors" />
              </button>
              <button
                onClick={() => router.push('/?category=graphics#work-gallery')}
                className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-studio-900 hover:text-white border border-black/5 text-slate-700 transition-all flex items-center gap-1.5 shadow-sm group"
              >
                <span>GRAPHICS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-coral-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Floating Perspective Carousel Stage */}
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[470px] sm:h-[530px] lg:h-[590px] my-6 flex items-center justify-center perspective-container cursor-grab active:cursor-grabbing select-none overflow-visible z-10"
        aria-label="3D Media Card Carousel"
      >
        {items.map((project, index) => {
          const isCurrent = index === activeIndex;

          return (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => {
                if (isCurrent) {
                  router.push(`/project/${project.slug}`);
                } else {
                  setActiveIndex(index);
                }
              }}
              className="absolute w-[320px] sm:w-[460px] md:w-[600px] lg:w-[680px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-slate-900/30 will-change-transform group bg-studio-950 border border-white/20"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Media Container with correct object-fit */}
              <div className="relative w-full h-full bg-studio-950">
                {project.hero_media_type === 'video' || project.video_preview_url ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={project.video_preview_url || project.hero_media_url}
                      poster={project.thumbnail_url}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Video Indicator Pill */}
                    <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono tracking-wider text-white flex items-center gap-1.5">
                      <VolumeX className="w-3 h-3 text-coral-400" />
                      <span>LOOPING</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={project.hero_media_url || project.thumbnail_url}
                    alt={project.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Dark Vignette & Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 pointer-events-none" />

                {/* Card Editorial Information */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between z-20">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-zinc-400">
                      <span className="px-2.5 py-0.5 rounded-full bg-coral-500/20 text-coral-400 border border-coral-500/30 uppercase tracking-wider font-semibold">
                        {project.category}
                      </span>
                      <span>•</span>
                      <span>{project.year}</span>
                      {project.client && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-300">{project.client}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white group-hover:text-coral-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed opacity-90">
                      {project.description}
                    </p>
                  </div>

                  {/* Open Detail Arrow with Coral hover */}
                  <Link
                    href={`/project/${project.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 rounded-full bg-white hover:bg-coral-500 text-black hover:text-white flex items-center justify-center transition-all transform group-hover:scale-110 shadow-xl shrink-0"
                    title="View Case Study"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Edge Sheen */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Carousel Controls & Status Bar (With Reference Red Button Accent) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/10 text-xs font-mono text-slate-500">
          {/* Active Project Counter & Title + Reference Red Circle Button */}
          <div className="flex items-center gap-4">
            {/* Iconic Red Circular Badge from Reference */}
            <div className="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-coral-500/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>

            <div className="flex items-center gap-2 text-studio-900 font-bold text-sm">
              <span>0{activeIndex + 1}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-500 font-normal">0{total}</span>
            </div>

            <span className="hidden md:inline-block text-slate-300">|</span>
            <span className="hidden md:inline-block text-slate-700 font-sans font-semibold truncate max-w-xs">
              {currentProject?.title}
            </span>
          </div>

          {/* Drag Cue */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px]">
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>Drag or use Arrow Keys to navigate</span>
          </div>

          {/* Navigation Buttons & Autoplay / Motion Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-2 rounded-full border transition-all text-[11px] flex items-center gap-1.5 ${reducedMotion
                ? 'bg-studio-900 text-white border-studio-900'
                : 'bg-white/80 text-slate-600 hover:text-studio-900 border-black/5 shadow-sm'
                }`}
              title="Toggle Reduced Motion"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {reducedMotion ? 'Reduced Motion' : 'Fluid 3D'}
              </span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-white/80 hover:bg-studio-900 hover:text-white border border-black/5 text-slate-700 shadow-sm transition-all"
              title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white hover:bg-studio-900 hover:text-white border border-black/5 text-studio-900 flex items-center justify-center transition-all shadow-sm"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white hover:bg-studio-900 hover:text-white border border-black/5 text-studio-900 flex items-center justify-center transition-all shadow-sm"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll-to-explore cue */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <a
            href="#work-gallery"
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-coral-500 transition-colors group cursor-pointer"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">
              Scroll To Explore Archive
            </span>
            <div className="w-4 h-7 rounded-full border border-slate-300 flex items-start justify-center p-1 bg-white/50">
              <div className="w-1 h-1.5 rounded-full bg-coral-500 animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

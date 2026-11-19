'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { Project, ProjectCategory } from '@/lib/types';
import ProjectCard from './ProjectCard';
import { Filter, Layers, Film, Box, PenTool, Search, Sparkles } from 'lucide-react';

interface ProjectGalleryProps {
  initialProjects: Project[];
}

export default function ProjectGallery({ initialProjects }: ProjectGalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeParam = (searchParams.get('category') as ProjectCategory) || 'all';

  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'all'>(activeParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sync state with URL search parameters
  useEffect(() => {
    if (activeParam !== activeCategory) {
      setActiveCategory(activeParam);
    }
  }, [activeParam]);

  const handleFilterChange = (category: ProjectCategory | 'all') => {
    if (category === activeCategory) return;

    setIsAnimating(true);

    if (gridRef.current) {
      gsap.to(gridRef.current.children, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        duration: 0.25,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => {
          setActiveCategory(category);
          const targetUrl = category === 'all' ? '/#work-gallery' : `/?category=${category}#work-gallery`;
          router.push(targetUrl, { scroll: false });
          setIsAnimating(false);
        },
      });
    } else {
      setActiveCategory(category);
      const targetUrl = category === 'all' ? '/#work-gallery' : `/?category=${category}#work-gallery`;
      router.push(targetUrl, { scroll: false });
      setIsAnimating(false);
    }
  };

  // Filter projects by category and search
  const filteredProjects = initialProjects.filter((project) => {
    const matchesCategory =
      activeCategory === 'all' ? true : project.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tools?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.client?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // GSAP enter animation when filteredProjects render
  useEffect(() => {
    if (gridRef.current && !isAnimating) {
      gsap.fromTo(
        gridRef.current.children,
        {
          opacity: 0,
          y: 20,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [activeCategory, filteredProjects.length, isAnimating]);

  const counts = {
    all: initialProjects.length,
    '3d': initialProjects.filter((p) => p.category === '3d').length,
    video: initialProjects.filter((p) => p.category === 'video').length,
    graphics: initialProjects.filter((p) => p.category === 'graphics').length,
  };

  return (
    <section id="work-gallery" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-coral-500" />
            <span>BEYOND THE PIXELS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tightest text-studio-900">
            Explore My Creations<span className="text-coral-500">.</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
            Explore my work in 3D, motion, and graphic design.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-black/5 text-xs text-studio-900 placeholder-slate-400 focus:outline-none focus:border-coral-500 focus:bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-sm ${activeCategory === 'all'
              ? 'bg-studio-900 text-white font-bold shadow-md'
              : 'bg-white/80 text-slate-700 hover:text-studio-900 hover:bg-white border border-black/5'
              }`}
          >
            <Layers className="w-3.5 h-3.5 text-coral-400" />
            <span>ALL WORK</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === 'all' ? 'bg-coral-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('3d')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-sm ${activeCategory === '3d'
              ? 'bg-studio-900 text-white font-bold shadow-md'
              : 'bg-white/80 text-slate-700 hover:text-studio-900 hover:bg-white border border-black/5'
              }`}
          >
            <Box className="w-3.5 h-3.5 text-coral-400" />
            <span>3D CGI</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === '3d' ? 'bg-coral-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
              {counts['3d']}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('video')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-sm ${activeCategory === 'video'
              ? 'bg-studio-900 text-white font-bold shadow-md'
              : 'bg-white/80 text-slate-700 hover:text-studio-900 hover:bg-white border border-black/5'
              }`}
          >
            <Film className="w-3.5 h-3.5 text-coral-400" />
            <span>MOTION & FILM</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === 'video' ? 'bg-coral-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
              {counts.video}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange('graphics')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 shadow-sm ${activeCategory === 'graphics'
              ? 'bg-studio-900 text-white font-bold shadow-md'
              : 'bg-white/80 text-slate-700 hover:text-studio-900 hover:bg-white border border-black/5'
              }`}
          >
            <PenTool className="w-3.5 h-3.5 text-coral-400" />
            <span>GRAPHICS</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeCategory === 'graphics' ? 'bg-coral-500 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
              {counts.graphics}
            </span>
          </button>
        </div>

        {/* View Indicator */}
        <div className="font-mono text-xs text-slate-500">
          Showing {filteredProjects.length} of {initialProjects.length} Works
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center glass-panel rounded-3xl border border-black/5 p-12">
          <p className="font-mono text-sm text-slate-500">
            No projects found matching the filter "{activeCategory}" or query "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              router.push('/#work-gallery', { scroll: false });
            }}
            className="mt-4 px-5 py-2.5 rounded-full bg-studio-900 text-white text-xs font-mono hover:bg-coral-500 transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

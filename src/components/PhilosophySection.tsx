'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, Cpu, Sparkles, Feather, Flame } from 'lucide-react';

export default function PhilosophySection() {
  return (
    <section className="py-24 sm:py-36 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Sculpted Container Plinth */}
        <div className="sculpted-plate rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 relative overflow-hidden">
          {/* Subtle Ambient Coral Glow in corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Editorial Subheader */}
          <div className="flex items-center gap-3 font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-coral-500" />
            <span>MY CREATIVE APPROACH</span>
          </div>

          {/* Large Editorial Manifesto Display */}
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest text-studio-900 leading-[1.15]">
              Where creative ideas{' '}
              <span className="underline decoration-coral-500/50 underline-offset-8">
                meet thoughtful
              </span>{' '}
              design and purpose<span className="text-coral-500">.</span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              I've always enjoyed turning ideas into something visual. Whether I'm working on a 3D model, an animation, or a graphic design project, I like to explore different approaches and focus on the small details that make the final result better. I'm always learning, trying new things, and looking for ways to improve my work.
            </p>
          </div>

          {/* Three Discipline Pillars */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 01: 3D */}
            <div className="p-8 rounded-3xl bg-white/90 border border-white/80 shadow-md flex flex-col justify-between group hover:shadow-xl hover:border-coral-500/30 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-studio-900 mb-6 group-hover:bg-coral-500 group-hover:text-white transition-all shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                  01 // 3D DESIGN
                </span>
                <h3 className="text-xl font-extrabold text-studio-900 mt-2 mb-3">
                  3D Visualization & CGI
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Creating realistic 3D models, environments, and product visuals with attention to every detail.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                3ds Max • Maya • Substance Painter • Vray • UE5
              </div>
            </div>

            {/* Pillar 02: Video */}
            <div className="p-8 rounded-3xl bg-white/90 border border-white/80 shadow-md flex flex-col justify-between group hover:shadow-xl hover:border-coral-500/30 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-studio-900 mb-6 group-hover:bg-coral-500 group-hover:text-white transition-all shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                  02 // MOTION DESIGN
                </span>
                <h3 className="text-xl font-extrabold text-studio-900 mt-2 mb-3">
                  Motion & Film
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bringing ideas to life through animation, cinematic visuals, and creative storytelling.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                After Effects • Premiere
              </div>
            </div>

            {/* Pillar 03: Graphics */}
            <div className="p-8 rounded-3xl bg-white/90 border border-white/80 shadow-md flex flex-col justify-between group hover:shadow-xl hover:border-coral-500/30 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-studio-900 mb-6 group-hover:bg-coral-500 group-hover:text-white transition-all shadow-sm">
                  <Feather className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                  03 // AI & CREATIVE TECHNOLOGY
                </span>
                <h3 className="text-xl font-extrabold text-studio-900 mt-2 mb-3">
                  AI-Powered Visual Creation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Using AI tools to explore new ideas, create visuals, and improve my creative workflow. Combining technology with creativity to bring ideas to life.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 font-mono text-[11px] text-slate-500">
                Higgsfield • Claude • ChatGPT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

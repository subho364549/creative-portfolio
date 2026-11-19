import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowUpRight, Cpu, Layers, Sparkles, Award, Globe, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — Subhojit Das Studio',
  description:
    'Creative Director, 3D visualization artist, and graphic designer specializing in architectural lookdev, motion film, and typographic systems.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 text-studio-900">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Editorial Header */}
        <div className="pb-12 border-b border-black/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-black/5 text-[11px] font-mono text-studio-600 uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
            <span>PORTFOLIO / ABOUT ME</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest text-studio-950 leading-[1.05]">
            Subhojit Das<span className="text-coral-500">.</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-studio-700 font-light leading-relaxed max-w-3xl">
            I create 3D visuals, cinematic videos, and AI-powered content, turning creative ideas into engaging visual experiences.
          </p>
        </div>

        {/* Studio Manifesto / Bio */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10">
          <div className="md:col-span-4 font-mono text-xs text-studio-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
            <span>ABOUT ME</span>
          </div>

          <div className="md:col-span-8 space-y-6 text-studio-700 font-sans text-base sm:text-lg leading-relaxed">
            <p>
              I'm a creative artist who loves bringing ideas to life through 3D, animation, and AI.
            </p>
            <p>
              I enjoy exploring new tools, experimenting with different styles, and creating visuals that tell a story. Every project is an opportunity for me to learn, improve, and create something unique.
            </p>
          </div>
        </div>

        {/* Hardware & Software Pipeline */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10">
          <div className="md:col-span-4 font-mono text-xs text-studio-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
            <span>TOOLS I USE</span>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-3 shadow-sm">
              <span className="text-studio-950 font-bold block">// 3D & CGI</span>
              <ul className="space-y-1.5 text-studio-600">
                <li>• Autodesk Maya</li>
                <li>• 3ds max</li>
                <li>• Substance 3D Painter</li>
                <li>• Unreal Engine 5</li>
                <li>• V-ray</li>
                <li>• Marvelous Designer</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-3 shadow-sm">
              <span className="text-studio-950 font-bold block">// MOTION & VIDEO</span>
              <ul className="space-y-1.5 text-studio-600">
                <li>• Adobe After Effects</li>
                <li>• Adobe Premiere Pro</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-3 shadow-sm">
              <span className="text-studio-950 font-bold block">// AI & CREATIVE TOOLS</span>
              <ul className="space-y-1.5 text-studio-600">
                <li>• Higgsfield AI</li>
                <li>• ChatGPT</li>
                <li>• Claude</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-3 shadow-sm">
              <span className="text-studio-950 font-bold block">// DESIGN & EDITING</span>
              <ul className="space-y-1.5 text-studio-600">
                <li>• Adobe Photoshop</li>
                <li>• Adobe Illustrator</li>
                <li>• Corel Draw</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Selected Clients & Collaborations */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10">
          <div className="md:col-span-4 font-mono text-xs text-studio-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
            <span>WHAT I CREATE</span>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-sm text-studio-800">
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">3D Modeling</div>
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">Texturing</div>
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">Lighting</div>
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">Video Editing</div>
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">Generative AI Content</div>
            <div className="p-4 rounded-2xl border border-black/5 bg-white/80 shadow-sm text-center font-medium">Graphic Design</div>
          </div>
        </div>
      </div>
    </div>
  );
}


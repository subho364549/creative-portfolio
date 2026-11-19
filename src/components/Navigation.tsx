'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, ArrowUpRight, ShieldCheck, Sparkles, Eye, Search } from 'lucide-react';
import { ProjectCategory } from '@/lib/types';

interface NavigationProps {
  onCategorySelect?: (cat: ProjectCategory | 'all') => void;
}

export default function Navigation({ onCategorySelect }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (cat: ProjectCategory | 'all', e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onCategorySelect) {
      onCategorySelect(cat);
    }

    if (pathname === '/') {
      const url = cat === 'all' ? '/' : `/?category=${cat}`;
      router.push(url, { scroll: false });
      // Scroll smoothly to gallery section if clicked from hero
      const galleryElem = document.getElementById('work-gallery');
      if (galleryElem && cat !== 'all') {
        galleryElem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const targetUrl = cat === 'all' ? '/' : `/?category=${cat}#work-gallery`;
      router.push(targetUrl);
    }
  };

  const isCategoryActive = (cat: string) => {
    if (pathname === '/') {
      return currentCategory === cat;
    }
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav py-3.5 shadow-md shadow-slate-900/5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo / Studio Brand with Coral Accent (Inspired by Skot.) */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-studio-900 hover:text-black transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-coral-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-coral-500/25 group-hover:scale-105 transition-all">
              SD
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-studio-900 leading-none">
                Subhojit<span className="text-coral-500">.</span>
              </span>
              <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase mt-1">
                3D & Motion Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean Frosted Glass Capsule) */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/70 border border-black/5 backdrop-blur-xl shadow-sm">
            <button
              onClick={(e) => handleCategoryClick('all', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                isCategoryActive('all') && pathname === '/'
                  ? 'bg-studio-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-studio-900 hover:bg-black/5'
              }`}
            >
              {isCategoryActive('all') && pathname === '/' && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              )}
              <span>All Work</span>
            </button>

            <button
              onClick={(e) => handleCategoryClick('3d', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                isCategoryActive('3d')
                  ? 'bg-studio-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-studio-900 hover:bg-black/5'
              }`}
            >
              {isCategoryActive('3d') && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              )}
              <span>3D CGI</span>
            </button>

            <button
              onClick={(e) => handleCategoryClick('video', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                isCategoryActive('video')
                  ? 'bg-studio-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-studio-900 hover:bg-black/5'
              }`}
            >
              {isCategoryActive('video') && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              )}
              <span>Video</span>
            </button>

            <button
              onClick={(e) => handleCategoryClick('graphics', e)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                isCategoryActive('graphics')
                  ? 'bg-studio-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-studio-900 hover:bg-black/5'
              }`}
            >
              {isCategoryActive('graphics') && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
              )}
              <span>Graphics</span>
            </button>

            <div className="w-[1px] h-4 bg-black/10 mx-1" />

            <Link
              href="/about"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                pathname === '/about'
                  ? 'bg-studio-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-studio-900 hover:bg-black/5'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action: Availability pill & circular admin button */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-black/5 text-xs font-medium text-slate-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
              <span>Available Q1/Q2</span>
            </div>

            <Link
              href="/admin"
              className="w-9 h-9 rounded-full bg-studio-900 hover:bg-coral-500 text-white flex items-center justify-center transition-all shadow-sm"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/admin"
              className="w-8 h-8 rounded-full bg-studio-900 text-white flex items-center justify-center"
              title="Admin"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-studio-900 bg-white/80 border border-black/5 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-studio-canvas/98 backdrop-blur-2xl md:hidden pt-24 px-6 pb-10 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase">
              // STUDIO NAVIGATION
            </span>

            <div className="flex flex-col gap-3">
              <button
                onClick={(e) => handleCategoryClick('all', e)}
                className={`text-left text-2xl font-bold py-2 border-b border-black/5 flex items-center justify-between ${
                  isCategoryActive('all') && pathname === '/'
                    ? 'text-coral-500'
                    : 'text-slate-700'
                }`}
              >
                <span>All Projects</span>
                <ArrowUpRight className="w-5 h-5 opacity-60" />
              </button>

              <button
                onClick={(e) => handleCategoryClick('3d', e)}
                className={`text-left text-2xl font-bold py-2 border-b border-black/5 flex items-center justify-between ${
                  isCategoryActive('3d') ? 'text-coral-500' : 'text-slate-700'
                }`}
              >
                <span>3D CGI Visualization</span>
                <span className="text-xs font-mono text-slate-400">01</span>
              </button>

              <button
                onClick={(e) => handleCategoryClick('video', e)}
                className={`text-left text-2xl font-bold py-2 border-b border-black/5 flex items-center justify-between ${
                  isCategoryActive('video') ? 'text-coral-500' : 'text-slate-700'
                }`}
              >
                <span>Motion & Video</span>
                <span className="text-xs font-mono text-slate-400">02</span>
              </button>

              <button
                onClick={(e) => handleCategoryClick('graphics', e)}
                className={`text-left text-2xl font-bold py-2 border-b border-black/5 flex items-center justify-between ${
                  isCategoryActive('graphics') ? 'text-coral-500' : 'text-slate-700'
                }`}
              >
                <span>Graphic Design</span>
                <span className="text-xs font-mono text-slate-400">03</span>
              </button>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left text-2xl font-bold py-2 border-b border-black/5 flex items-center justify-between ${
                  pathname === '/about' ? 'text-coral-500' : 'text-slate-700'
                }`}
              >
                <span>About</span>
                <ArrowUpRight className="w-5 h-5 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-black/10 flex flex-col gap-2 font-mono text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Direct:</span>
              <span className="text-studio-900 font-semibold">subhojit.creative@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

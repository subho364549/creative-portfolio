'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Shield, Sparkles, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Footer() {
  const [time, setTime] = useState<string>('');
  const [supabaseActive, setSupabaseActive] = useState<boolean>(false);

  useEffect(() => {
    setSupabaseActive(isSupabaseConfigured());

    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-black/10 bg-white/70 backdrop-blur-xl text-slate-600 py-16 text-xs font-mono relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-black/10">
          {/* Col 1: Studio identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-studio-900 font-extrabold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-coral-500" />
              <span>SUBHOJIT DAS</span>
            </div>
            <p className="text-slate-500 font-sans text-xs leading-relaxed max-w-xs">
              Independent Creative Direction, 3D LookDev, Motion Film, and Editorial Typographic Systems.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              LOCAL TIME: <span className="text-studio-900 font-bold">{time || '00:00:00 UTC'}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <span className="text-studio-900 font-bold uppercase tracking-widest text-[11px] block mb-4">
              // DISCIPLINE ARCHIVE
            </span>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link href="/?category=3d#work-gallery" className="hover:text-coral-500 transition-colors">
                  3D Spatial Visualization
                </Link>
              </li>
              <li>
                <Link href="/?category=video#work-gallery" className="hover:text-coral-500 transition-colors">
                  Cinematic Motion & Video
                </Link>
              </li>
              <li>
                <Link href="/?category=graphics#work-gallery" className="hover:text-coral-500 transition-colors">
                  Editorial Graphic Systems
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-coral-500 transition-colors">
                  Studio Biography & Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiries */}
          <div>
            <span className="text-studio-900 font-bold uppercase tracking-widest text-[11px] block mb-4">
              // INQUIRIES & SOCIAL
            </span>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <a
                  href="mailto:sd4507997@gmail.com"
                  className="hover:text-coral-500 transition-colors text-studio-900 font-semibold flex items-center gap-1.5"
                >
                  <span>sd4507997@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/subhomatic?utm_source=ig_web_button_share_sheet&exln=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-coral-500 transition-colors"
                >
                  Instagram / @subhomatic
                </a>
              </li>
              <li>
                <a
                  href="https://www.artstation.com/subhojitdas"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-coral-500 transition-colors"
                >
                  Artstation
                </a>
              </li>
              <li>
                <a
                  href="https://www.behance.net/subhojitdas30"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-coral-500 transition-colors"
                >
                  Behance Portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/subhojit-das-8347a7296/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-coral-500 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine & Admin */}
          <div className="space-y-4">
            <span className="text-studio-900 font-bold uppercase tracking-widest text-[11px] block mb-4">
              // ARCHITECTURE
            </span>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-black/5 shadow-sm">
              <Database className="w-4 h-4 text-coral-500 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] text-studio-900 font-bold">
                  {supabaseActive ? 'Supabase Cloud Connected' : 'Local Hybrid Studio Engine'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {supabaseActive ? 'Postgres & Storage' : 'Ready for Supabase'}
                </span>
              </div>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-studio-900 hover:bg-coral-500 text-[11px] text-white transition-colors shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Subhojit Das Studio. All rights reserved. Tactile Studio Edition.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-studio-900 hover:text-coral-500 transition-colors font-bold group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-coral-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}

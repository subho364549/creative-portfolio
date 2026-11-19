'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Database,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    // If Supabase is configured, check if already signed in
    if (configured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.push('/admin/dashboard');
        }
      });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.session) {
          router.push('/admin/dashboard');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Local mode: login with provided credentials or default admin
      const adminEmail = email.trim() || 'admin@subhojitdas.design';
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      sessionStorage.setItem('portfolio_admin_email', adminEmail);
      router.push('/admin/dashboard');
    }
  };

  const enterDemoAdminMode = () => {
    sessionStorage.setItem('portfolio_admin_auth', 'true');
    sessionStorage.setItem('portfolio_admin_email', 'admin@subhojitdas.design');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-studio-850 border border-white/10 flex items-center justify-center mx-auto text-warm-white shadow-2xl mb-4">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Studio Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
            // PROTECTED ARCHIVE DASHBOARD
          </p>
        </div>

        {/* Supabase Status Alert */}
        <div className="mb-6 p-4 rounded-xl glass-panel border border-white/10 flex items-start gap-3">
          <Database className={`w-5 h-5 shrink-0 mt-0.5 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div className="text-xs">
            <span className="font-semibold text-white block">
              {isConfigured ? 'Connected to Supabase' : 'Local Hybrid Admin Mode Active'}
            </span>
            <span className="text-zinc-400 font-sans block mt-0.5">
              {isConfigured
                ? 'Authentication and storage are using your live Supabase cloud database.'
                : 'Supabase credentials not yet set in .env.local. You can log in using any credentials to test full CRUD, file uploads, and hero slider management!'}
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 bg-studio-900/60 shadow-2xl">
          {/* Quick Demo Access Button at top */}
          {!isConfigured && (
            <div className="mb-6 pb-6 border-b border-white/10">
              <button
                type="button"
                onClick={enterDemoAdminMode}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-black fill-black" />
                <span>ENTER ADMIN DASHBOARD (ONE-CLICK)</span>
              </button>
              <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                Local admin mode active — no password required
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@subhojitdas.design"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                SECRET KEY / PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-white text-black font-bold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          {!isConfigured && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                onClick={enterDemoAdminMode}
                className="w-full py-2.5 rounded-xl bg-studio-850 hover:bg-studio-800 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Access (One-Click)</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}


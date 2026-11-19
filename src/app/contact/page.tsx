'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Send, Clock, ArrowUpRight, MessageSquare } from 'lucide-react';
import { ProjectCategory } from '@/lib/types';

export default function ContactPage() {
  const [category, setCategory] = useState<ProjectCategory | 'general'>('3d');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '$5k - $15k',
    timeline: 'Q2 / Q3 2026',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate clean dispatch
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 text-studio-900">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="pb-12 border-b border-black/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-black/5 text-[11px] font-mono text-studio-600 uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
            <span>DIRECT INQUIRIES & COMMISSIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tightest text-studio-950 leading-tight">
            Initiate a Dialogue<span className="text-coral-500">.</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-studio-700 font-light leading-relaxed max-w-2xl">
            Currently accepting select 3D visualization, cinematic motion, and identity commissions for 2026.
          </p>
        </div>

        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="md:col-span-8">
            {submitted ? (
              <div className="p-8 rounded-3xl sculpted-plate border border-black/5 bg-white/90 text-center space-y-4 shadow-md">
                <CheckCircle2 className="w-12 h-12 text-coral-500 mx-auto" />
                <h3 className="text-2xl font-bold text-studio-950">Inquiry Transmitted</h3>
                <p className="text-sm text-studio-600 font-sans max-w-md mx-auto">
                  Thank you for your interest. Subhojit will review your project brief and respond within 24 to 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-studio-900 hover:bg-coral-500 text-white text-xs font-mono font-semibold transition-all shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selector */}
                <div>
                  <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-3">
                    // DISCIPLINE OF INTEREST
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '3d', label: '3D CGI' },
                      { id: 'video', label: 'MOTION / FILM' },
                      { id: 'graphics', label: 'GRAPHIC DESIGN' },
                      { id: 'general', label: 'OTHER' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id as any)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-mono border transition-all text-center ${
                          category === item.id
                            ? 'bg-studio-900 text-white font-semibold border-studio-900 shadow-md'
                            : 'bg-white/80 text-studio-600 border-black/5 hover:bg-white hover:text-studio-900'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-2">
                      NAME / STUDIO *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe or Studio Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/10 text-studio-900 placeholder-studio-400 text-sm focus:outline-none focus:border-coral-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-2">
                      CONTACT EMAIL *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/10 text-studio-900 placeholder-studio-400 text-sm focus:outline-none focus:border-coral-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-2">
                      ESTIMATED BUDGET
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/10 text-studio-900 text-sm focus:outline-none focus:border-coral-500 shadow-sm"
                    >
                      <option value="$3k - $5k">$3,000 — $5,000</option>
                      <option value="$5k - $15k">$5,000 — $15,000</option>
                      <option value="$15k - $30k">$15,000 — $30,000</option>
                      <option value="$30k+">$30,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-2">
                      TARGET TIMELINE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Q2 2026, or 4 Weeks"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/10 text-studio-900 placeholder-studio-400 text-sm focus:outline-none focus:border-coral-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-mono text-xs text-studio-500 uppercase tracking-widest mb-2">
                    PROJECT OBJECTIVE & CONTEXT *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the scope, deliverables, visual style references, and project goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-black/10 text-studio-900 placeholder-studio-400 text-sm focus:outline-none focus:border-coral-500 shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-studio-900 hover:bg-coral-500 text-white font-bold text-xs font-mono tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-coral-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <span>TRANSMITTING...</span>
                  ) : (
                    <>
                      <span>TRANSMIT PROJECT BRIEF</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Direct Details Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-4 shadow-sm">
              <span className="font-mono text-xs text-studio-500 uppercase tracking-widest block">
                DIRECT CHANNELS
              </span>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-studio-400 block text-[10px]">ELECTRONIC MAIL</span>
                  <a
                    href="mailto:sd4507997@gmail.com"
                    className="text-studio-950 font-medium hover:text-coral-500 hover:underline text-sm font-sans"
                  >
                    sd4507997@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-studio-400 block text-[10px]">RESPONSE WINDOW</span>
                  <span className="text-studio-700">Within 24 to 48 hours</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl sculpted-plate border border-black/5 bg-white/80 space-y-3 font-mono text-xs shadow-sm">
              <span className="text-studio-500 uppercase tracking-widest block">
                AVAILABILITY & LOCATION
              </span>
              <div className="flex items-center gap-2 text-coral-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-coral-500" />
                <span>Open for Commissions</span>
              </div>
              <p className="text-studio-600 font-sans text-xs leading-relaxed">
                Worldwide remote collaboration with clients in New York, London, Zurich, Tokyo, and Singapore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


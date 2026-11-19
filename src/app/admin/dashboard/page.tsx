'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  UploadCloud,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Database,
  LogOut,
  Sparkles,
  ExternalLink,
  Film,
  Box,
  PenTool,
  Image as ImageIcon,
  FileText,
  RotateCcw,
  Check,
  X,
  Layers,
  Video,
  Play
} from 'lucide-react';
import { Project, ProjectCategory, MediaItem } from '@/lib/types';
import {
  getProjects,
  saveProject,
  deleteProject,
  reorderProjects,
  resetToSampleData
} from '@/lib/projects-service';
import { uploadPortfolioMedia, validateMediaFile } from '@/lib/storage-service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | 'all'>('all');
  const [isConfigured, setIsConfigured] = useState(false);
  const [adminUser, setAdminUser] = useState<string>('Admin');

  // Modal / Drawer state for creating / editing
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Drag and drop states
  const [isHeroDragOver, setIsHeroDragOver] = useState(false);
  const [isMultiDragOver, setIsMultiDragOver] = useState(false);

  // Live preview modal & Supabase setup modal
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // File input refs
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Tools tag input
  const [tagInput, setTagInput] = useState('');

  // Authentication check
  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (configured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.push('/admin');
        } else {
          setAdminUser(data.session.user.email || 'Admin');
        }
      });
    } else {
      // Local mode: allow seamless access without kicking user out
      const localAuth = sessionStorage.getItem('portfolio_admin_auth');
      if (!localAuth) {
        sessionStorage.setItem('portfolio_admin_auth', 'true');
        sessionStorage.setItem('portfolio_admin_email', 'Studio Admin (Local)');
        setAdminUser('Studio Admin (Local)');
      } else {
        setAdminUser(sessionStorage.getItem('portfolio_admin_email') || 'Studio Admin');
      }
    }

    loadProjects();
  }, [router]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects({ includeUnpublished: true });
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('portfolio_admin_auth');
    sessionStorage.removeItem('portfolio_admin_email');
    router.push('/admin');
  };

  const openNewProjectModal = () => {
    setEditingProject({
      title: '',
      slug: '',
      category: '3d',
      description: '',
      content: '',
      client: '',
      year: new Date().getFullYear().toString(),
      role: 'Creative Director',
      tools: ['Cinema 4D', 'Octane'],
      thumbnail_url: '/portfolio/3d/monolith-titanium.svg',
      video_preview_url: '',
      hero_media_url: '/portfolio/3d/monolith-titanium.svg',
      hero_media_type: 'image',
      featured: false,
      show_in_hero: false,
      hero_order: projects.length + 1,
      published: true,
      sort_order: projects.length + 1,
      media_items: [],
    });
    setUploadError(null);
    setUploadProgress(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject({ ...p });
    setUploadError(null);
    setUploadProgress(null);
    setIsEditorOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) {
      setUploadError('Project title is required.');
      return;
    }

    try {
      setLoading(true);
      const saved = await saveProject(editingProject as any);
      setIsEditorOpen(false);
      setEditingProject(null);
      await loadProjects();
      showToast('success', `Project "${saved.title}" saved successfully.`);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      await loadProjects();
      showToast('success', `Deleted "${title}".`);
    } catch (err) {
      showToast('error', 'Failed to delete project.');
    }
  };

  const handleTogglePublish = async (p: Project) => {
    try {
      await saveProject({ ...p, published: !p.published });
      await loadProjects();
      showToast('success', `Project ${!p.published ? 'Published' : 'Unpublished'}.`);
    } catch (err) {
      showToast('error', 'Failed to update status.');
    }
  };

  const handleToggleHeroSlider = async (p: Project) => {
    try {
      await saveProject({ ...p, show_in_hero: !p.show_in_hero });
      await loadProjects();
      showToast('success', `Updated homepage slider selection.`);
    } catch (err) {
      showToast('error', 'Failed to update hero slider.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const ids = reordered.map((p) => p.id);
    await reorderProjects(ids);
    setProjects(reordered);
  };

  // Upload a single primary hero/thumbnail file
  const processHeroFile = async (file: File) => {
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file format.');
      return;
    }

    try {
      setUploadError(null);
      setUploadProgress(10);
      const res = await uploadPortfolioMedia(
        file,
        editingProject?.category || 'general',
        (pct) => setUploadProgress(pct)
      );

      const isVideo = res.type === 'video';

      setEditingProject((prev) => ({
        ...prev,
        thumbnail_url: isVideo ? prev?.thumbnail_url || res.url : res.url,
        hero_media_url: res.url,
        hero_media_type: res.type,
        video_preview_url: isVideo ? res.url : prev?.video_preview_url,
      }));

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1000);
      showToast('success', `Uploaded ${file.name}`);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
      setUploadProgress(null);
    }
  };

  // Upload multiple supporting media files
  const processMultipleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    try {
      setUploadError(null);
      setUploadProgress(10);

      const newItems: MediaItem[] = [...(editingProject?.media_items || [])];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateMediaFile(file);
        if (!validation.valid) continue;

        const res = await uploadPortfolioMedia(
          file,
          editingProject?.category || 'general',
          (pct) => setUploadProgress(Math.round(((i + 1) / files.length) * 100))
        );

        newItems.push({
          id: `media-${Date.now()}-${i}`,
          url: res.url,
          type: res.type,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          sort_order: newItems.length + 1,
        });
      }

      setEditingProject((prev) => ({
        ...prev,
        media_items: newItems,
      }));

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 1000);
      showToast('success', `Uploaded ${files.length} supporting media items.`);
    } catch (err: any) {
      setUploadError(err.message || 'Supporting media upload failed.');
      setUploadProgress(null);
    }
  };

  // Drag-and-drop handlers for Hero Media
  const handleHeroDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHeroDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processHeroFile(e.dataTransfer.files[0]);
    }
  };

  // Drag-and-drop handlers for Supporting Gallery
  const handleMultiDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsMultiDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTools = editingProject?.tools || [];
    if (!currentTools.includes(tagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tools: [...currentTools, tagInput.trim()],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTools = editingProject?.tools || [];
    setEditingProject({
      ...editingProject,
      tools: currentTools.filter((t) => t !== tagToRemove),
    });
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filtered = projects.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-28 bg-background text-foreground">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-xl flex items-center gap-3 shadow-2xl transition-all border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/90 border-red-500/40 text-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-xs font-mono">{statusMessage.text}</span>
        </div>
      )}

      {/* SQL Migration Setup Modal */}
      {showSqlGuide && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-3xl w-full max-h-[85vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-mono">Supabase Setup Guide & SQL</h3>
              </div>
              <button
                onClick={() => setShowSqlGuide(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-zinc-300">
              <p className="text-zinc-400 font-sans text-sm">
                Your portfolio currently stores media on disk in <code>public/uploads</code> and <code>data/projects.json</code>.
                To connect your live cloud database at Supabase:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-zinc-300 font-sans">
                <li>Create a free project at <strong>supabase.com</strong>.</li>
                <li>In your Supabase project, go to the <strong>SQL Editor</strong> tab on the left.</li>
                <li>Copy and run the SQL migration code from <code>supabase/migrations/01_init.sql</code>.</li>
                <li>Under <strong>Project Settings → API</strong>, copy your <strong>URL</strong> and <strong>anon public key</strong>.</li>
                <li>Paste them into your local <code>.env.local</code> file and restart the server.</li>
              </ol>

              <div className="pt-4">
                <span className="text-white block mb-2 font-bold">// SQL MIGRATION LOCATION</span>
                <div className="p-4 rounded-xl bg-studio-950 border border-white/10 font-mono text-[11px] text-zinc-400 overflow-x-auto">
                  supabase/migrations/01_init.sql
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSqlGuide(false)}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-2xl w-full glass-panel p-6 sm:p-8 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="font-mono text-xs text-zinc-400 uppercase">
                // LIVE PROJECT PREVIEW
              </span>
              <button
                onClick={() => setPreviewProject(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-studio-950 mb-4">
              {previewProject.hero_media_type === 'video' || previewProject.video_preview_url ? (
                <video
                  src={previewProject.video_preview_url || previewProject.hero_media_url}
                  poster={previewProject.thumbnail_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={previewProject.hero_media_url || previewProject.thumbnail_url}
                  alt={previewProject.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white uppercase">
                  {previewProject.category}
                </span>
                <span>•</span>
                <span>{previewProject.year}</span>
                <span>•</span>
                <span>{previewProject.client || 'COMMISSION'}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{previewProject.title}</h3>
              <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                {previewProject.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LOGGED IN AS: {adminUser}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Content Management Console
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Upload 3D renders, cinematic video, and graphic design without touching source code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSqlGuide(true)}
              className="px-3.5 py-2 rounded-xl bg-studio-900 hover:bg-studio-850 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isConfigured ? 'Supabase Live' : 'Supabase Config'}</span>
            </button>

            <button
              onClick={openNewProjectModal}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>NEW PROJECT</span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-xl bg-studio-900 hover:bg-studio-850 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Metric Bar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'ALL WORK' },
              { id: '3d', label: '3D CGI' },
              { id: 'video', label: 'VIDEO' },
              { id: 'graphics', label: 'GRAPHICS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  filterCategory === tab.id
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-studio-900 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>TOTAL: {projects.length}</span>
            <span>•</span>
            <span className="text-emerald-400">
              PUBLISHED: {projects.filter((p) => p.published).length}
            </span>
            <span>•</span>
            <span className="text-indigo-400">
              HERO SLIDER: {projects.filter((p) => p.show_in_hero).length}
            </span>
          </div>
        </div>

        {/* Project Table / List */}
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden bg-studio-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-studio-950/60 text-zinc-400">
                  <th className="py-3.5 px-4">ORDER</th>
                  <th className="py-3.5 px-4">THUMBNAIL</th>
                  <th className="py-3.5 px-4">PROJECT DETAILS</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4 text-center">HERO SLIDER</th>
                  <th className="py-3.5 px-4 text-center">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((project, index) => (
                  <tr
                    key={project.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Order adjustment */}
                    <td className="py-4 px-4 whitespace-nowrap text-zinc-500">
                      <div className="flex items-center gap-1">
                        <span className="w-5 text-center font-bold text-zinc-400">
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === filtered.length - 1}
                            className="p-1 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="w-16 h-11 rounded-lg overflow-hidden bg-studio-950 border border-white/10 relative">
                        {project.hero_media_type === 'video' || project.video_preview_url ? (
                          <div className="w-full h-full relative">
                            <img
                              src={project.thumbnail_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-4">
                      <div className="max-w-xs sm:max-w-md">
                        <div className="font-bold text-sm text-white group-hover:text-warm-cream transition-colors truncate">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {project.client ? `${project.client} • ` : ''}
                          {project.year}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300 uppercase">
                        {project.category}
                      </span>
                    </td>

                    {/* Hero Slider Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleHeroSlider(project)}
                        className={`px-2.5 py-1 rounded-full text-[10px] border transition-all ${
                          project.show_in_hero
                            ? 'bg-indigo-950 border-indigo-500/40 text-indigo-300 font-bold'
                            : 'bg-studio-950 border-white/10 text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Toggle inclusion in homepage 3D animated hero slider"
                      >
                        {project.show_in_hero ? 'HERO SLIDER: ON' : 'OFF'}
                      </button>
                    </td>

                    {/* Status Publish Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border transition-all ${
                          project.published
                            ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 font-bold'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {project.published ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>PUBLISHED</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-zinc-500" />
                            <span>DRAFT</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewProject(project)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Preview Card"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/project/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Create / Edit Drawer Modal with Drag-and-Drop */}
        {isEditorOpen && editingProject && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-4xl w-full max-h-[92vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-2xl border border-white/20">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="font-mono text-xs text-warm-accent uppercase tracking-widest block">
                    {editingProject.id ? '// MODIFY RECORD' : '// INITIALIZE NEW RECORD'}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {editingProject.id ? `Edit: ${editingProject.title}` : 'Create New Portfolio Work'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {uploadError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Progress Bar */}
              {uploadProgress !== null && (
                <div className="mb-6 space-y-1.5 font-mono text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-cyan-400">
                      <UploadCloud className="w-4 h-4 animate-bounce" />
                      <span>UPLOADING MEDIA TO PERMANENT STORAGE...</span>
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-studio-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveProject} className="space-y-6">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                      PROJECT TITLE *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Monolith: Spatial Architecture"
                      value={editingProject.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        setEditingProject({ ...editingProject, title, slug });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                      URL SLUG *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="monolith-spatial-architecture"
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Category & Client & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                      CATEGORY *
                    </label>
                    <select
                      value={editingProject.category || '3d'}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as ProjectCategory,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    >
                      <option value="3d">3D CGI Visualization</option>
                      <option value="video">Motion & Film</option>
                      <option value="graphics">Graphic Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                      CLIENT / COMMISSIONER
                    </label>
                    <input
                      type="text"
                      placeholder="Apex Spatial Lab"
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                      YEAR
                    </label>
                    <input
                      type="text"
                      placeholder="2026"
                      value={editingProject.year || '2026'}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* DRAG-AND-DROP PRIMARY HERO MEDIA ZONE */}
                <div className="p-5 rounded-2xl border border-white/15 bg-studio-950/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">
                        // PRIMARY HERO MEDIA & THUMBNAIL
                      </label>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Accepts JPG, PNG, WEBP images or MP4, WEBM videos (Up to 150MB)
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-zinc-300">
                      TYPE: {editingProject.hero_media_type?.toUpperCase()}
                    </span>
                  </div>

                  {/* Drag and Drop Box */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsHeroDragOver(true);
                    }}
                    onDragLeave={() => setIsHeroDragOver(false)}
                    onDrop={handleHeroDrop}
                    onClick={() => heroFileInputRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                      isHeroDragOver
                        ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]'
                        : 'border-white/15 hover:border-white/40 bg-studio-900/50 hover:bg-studio-900'
                    }`}
                  >
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                      onChange={(e) => {
                        if (e.target.files?.[0]) processHeroFile(e.target.files[0]);
                      }}
                      className="hidden"
                    />

                    {editingProject.hero_media_url ? (
                      <div className="w-full flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-48 h-28 rounded-lg overflow-hidden bg-black border border-white/20 shrink-0">
                          {editingProject.hero_media_type === 'video' ? (
                            <video
                              src={editingProject.hero_media_url}
                              poster={editingProject.thumbnail_url}
                              muted
                              loop
                              autoPlay
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={editingProject.hero_media_url}
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="text-left space-y-1">
                          <span className="font-mono text-xs text-white font-semibold block">
                            Active Media Loaded
                          </span>
                          <p className="font-mono text-[11px] text-zinc-400 break-all max-w-md">
                            {editingProject.hero_media_url}
                          </p>
                          <span className="inline-block text-[10px] font-mono text-cyan-400">
                            Click or drag another file to replace
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
                        <span className="text-sm font-semibold text-white">
                          Drag & drop your primary 3D render, video, or graphic here
                        </span>
                        <span className="text-xs text-zinc-500 font-mono mt-1">
                          or click to browse from your computer
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Looping Preview URL */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                    VIDEO HOVER PREVIEW URL (MP4 / WEBM)
                  </label>
                  <input
                    type="text"
                    placeholder="https://.../preview.mp4 (automatically populated when uploading a video)"
                    value={editingProject.video_preview_url || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, video_preview_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                    SHORT EDITORIAL DESCRIPTION *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Short 1-2 sentence aesthetic summary for gallery cards and hero..."
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                {/* Software Tools Tags */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                    SOFTWARE & TOOLS USED
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Cinema 4D, Octane, Houdini, Blender, After Effects"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-studio-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30 w-64"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                    >
                      Add Tool
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {editingProject.tools?.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-300"
                      >
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tool)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detailed Narrative Content */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
                    CASE STUDY CONTENT (SUPPORTS HEADINGS & SPECIFICATIONS)
                  </label>
                  <textarea
                    rows={6}
                    placeholder="# Architectural Mass & Materiality&#10;&#10;Explain the physical lighting, caustic dispersion pass, or typographic grid rules..."
                    value={editingProject.content || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* DRAG-AND-DROP MULTI-MEDIA SUPPORTING GALLERY */}
                <div className="p-5 rounded-2xl border border-white/15 bg-studio-950/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 uppercase tracking-widest font-bold">
                        // SUPPORTING MULTI-MEDIA PLATES ({editingProject.media_items?.length || 0})
                      </label>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Drag and drop multiple images or videos for the project case study gallery
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => multiFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-studio-900 hover:bg-studio-850 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Browse Files</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={multiFileInputRef}
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                    onChange={(e) => {
                      if (e.target.files) processMultipleFiles(e.target.files);
                    }}
                    className="hidden"
                  />

                  {/* Multi-Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsMultiDragOver(true);
                    }}
                    onDragLeave={() => setIsMultiDragOver(false)}
                    onDrop={handleMultiDrop}
                    className={`rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                      isMultiDragOver
                        ? 'border-indigo-400 bg-indigo-950/20 scale-[1.01]'
                        : 'border-white/10 hover:border-white/30 bg-studio-900/40'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-zinc-300 block">
                      Drop multiple renders, wireframes, and video clips here
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                      JPG, PNG, WEBP, MP4, WEBM
                    </span>
                  </div>

                  {/* Media Items Grid */}
                  {editingProject.media_items && editingProject.media_items.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {editingProject.media_items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/15 bg-studio-900 group"
                        >
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              muted
                              loop
                              autoPlay
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.caption || `Media ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingProject.media_items?.filter((_, i) => i !== idx);
                                setEditingProject({ ...editingProject, media_items: updated });
                              }}
                              className="p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white"
                              title="Delete plate"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="absolute bottom-1 left-2 text-[9px] font-mono text-zinc-400 bg-black/60 px-1 rounded truncate max-w-[80%]">
                            {item.caption || `Plate ${idx + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggles: Featured, Show in Hero Slider, Published */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-studio-950/40 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingProject.published ?? true}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, published: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-black bg-studio-900 border-white/20 focus:ring-0"
                    />
                    <div>
                      <span className="font-mono text-xs text-white block font-bold">PUBLISHED</span>
                      <span className="font-mono text-[10px] text-zinc-500">Visible in public archive</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-studio-950/40 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingProject.show_in_hero ?? false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, show_in_hero: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-black bg-studio-900 border-white/20 focus:ring-0"
                    />
                    <div>
                      <span className="font-mono text-xs text-white block font-bold">HOMEPAGE 3D SLIDER</span>
                      <span className="font-mono text-[10px] text-zinc-500">Floating perspective card</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-studio-950/40 cursor-pointer hover:border-white/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingProject.featured ?? false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-black bg-studio-900 border-white/20 focus:ring-0"
                    />
                    <div>
                      <span className="font-mono text-xs text-white block font-bold">FEATURED HIGHLIGHT</span>
                      <span className="font-mono text-[10px] text-zinc-500">Priority showcase badge</span>
                    </div>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(editingProject as Project)}
                    className="px-4 py-2.5 rounded-xl bg-studio-900 hover:bg-studio-850 border border-white/10 text-zinc-300 font-mono text-xs flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Card</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-studio-900 hover:bg-studio-850 text-zinc-300 font-mono text-xs"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs font-mono tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl"
                    >
                      <Check className="w-4 h-4 text-black" />
                      <span>SAVE & PUBLISH</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

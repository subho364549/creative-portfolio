import { Project, ProjectCategory } from './types';
import { INITIAL_PROJECTS } from './sample-data';
import { supabase, isSupabaseConfigured } from './supabase';

const DATA_FILE_REL = 'data/projects.json';

// Server-side helper to read persistent JSON on disk
async function getServerProjects(): Promise<Project[]> {
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'projects.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  }
  return INITIAL_PROJECTS;
}

export async function getProjects(options?: {
  category?: ProjectCategory | 'all';
  includeUnpublished?: boolean;
  heroOnly?: boolean;
}): Promise<Project[]> {
  const { category = 'all', includeUnpublished = false, heroOnly = false } = options || {};

  // If in browser, fetch through API
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (includeUnpublished) params.set('includeUnpublished', 'true');
      if (heroOnly) params.set('heroOnly', 'true');

      const res = await fetch(`/api/projects?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return data as Project[];
      }
    } catch (err) {
      console.warn('API getProjects failed in browser, using fallback:', err);
    }
  }

  // 1. If Supabase is configured, query Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          media_items:project_media (*)
        `)
        .order('sort_order', { ascending: true });

      if (!includeUnpublished) {
        query = query.eq('published', true);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (heroOnly) {
        query = query.eq('show_in_hero', true).order('hero_order', { ascending: true });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Project[];
      }
    } catch (err) {
      console.warn('Supabase getProjects error, falling back to disk:', err);
    }
  }

  // 2. Read from disk JSON storage
  let list = await getServerProjects();

  if (!includeUnpublished) {
    list = list.filter((p) => p.published);
  }

  if (category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (heroOnly) {
    list = list
      .filter((p) => p.show_in_hero)
      .sort((a, b) => (a.hero_order ?? 99) - (b.hero_order ?? 99));
  } else {
    list = list.sort((a, b) => a.sort_order - b.sort_order);
  }

  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          media_items:project_media (*)
        `)
        .eq('slug', slug)
        .single();

      if (!error && data) {
        if (data.media_items && Array.isArray(data.media_items)) {
          data.media_items.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        }
        return data as Project;
      }
    } catch (err) {
      console.warn('Supabase getProjectBySlug failed, falling back:', err);
    }
  }

  const all = await getServerProjects();
  const found = all.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProject(project: Partial<Project> & { title: string }): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to save project');
  }

  return await res.json();
}

export async function deleteProject(id: string): Promise<boolean> {
  const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to delete project');
  }

  return true;
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const res = await fetch('/api/projects', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  });

  if (!res.ok) {
    throw new Error('Failed to reorder projects');
  }
}

export async function resetToSampleData(): Promise<void> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(INITIAL_PROJECTS[0]),
  });
}

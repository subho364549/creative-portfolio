import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Project, ProjectCategory } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PROJECTS } from '@/lib/sample-data';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

async function readProjectsFromFile(): Promise<Project[]> {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROJECTS;
  } catch (err) {
    console.warn('Could not read projects.json, falling back to INITIAL_PROJECTS:', err);
    return INITIAL_PROJECTS;
  }
}

async function writeProjectsToFile(projects: Project[]): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to projects.json:', err);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as ProjectCategory | 'all' | null;
  const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
  const heroOnly = searchParams.get('heroOnly') === 'true';

  // If Supabase is connected, query Supabase
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

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (heroOnly) {
        query = query.eq('show_in_hero', true).order('hero_order', { ascending: true });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Supabase query failed in API, falling back to JSON store:', err);
    }
  }

  // Fallback to disk JSON store
  let list = await readProjectsFromFile();

  if (!includeUnpublished) {
    list = list.filter((p) => p.published);
  }

  if (category && category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  if (heroOnly) {
    list = list
      .filter((p) => p.show_in_hero)
      .sort((a, b) => (a.hero_order ?? 99) - (b.hero_order ?? 99));
  } else {
    list = list.sort((a, b) => a.sort_order - b.sort_order);
  }

  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // 1. If Supabase is configured, save to Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const isNew = !body.id || body.id.startsWith('temp-') || body.id.startsWith('proj-');
        const payload: any = {
          title: body.title,
          slug,
          category: body.category || '3d',
          description: body.description || '',
          content: body.content || '',
          client: body.client || '',
          year: body.year || new Date().getFullYear().toString(),
          role: body.role || '',
          tools: body.tools || [],
          thumbnail_url: body.thumbnail_url,
          video_preview_url: body.video_preview_url || null,
          hero_media_url: body.hero_media_url || body.thumbnail_url,
          hero_media_type: body.hero_media_type || 'image',
          featured: body.featured ?? false,
          show_in_hero: body.show_in_hero ?? false,
          hero_order: body.hero_order ?? 1,
          published: body.published ?? true,
          sort_order: body.sort_order ?? 1,
          updated_at: now,
        };

        if (isNew) {
          payload.created_at = now;
          const { data, error } = await supabase.from('projects').insert(payload).select().single();
          if (!error && data) {
            // Also insert media items
            if (body.media_items && Array.isArray(body.media_items)) {
              const mediaItems = body.media_items.map((m: any, idx: number) => ({
                project_id: data.id,
                url: m.url,
                type: m.type,
                caption: m.caption || null,
                poster_url: m.poster_url || null,
                sort_order: m.sort_order ?? idx + 1,
              }));
              await supabase.from('project_media').insert(mediaItems);
            }
          }
        } else {
          await supabase.from('projects').update(payload).eq('id', body.id);
        }
      } catch (err) {
        console.warn('Supabase save error, persisting to JSON file:', err);
      }
    }

    // 2. Persist to disk JSON store
    const list = await readProjectsFromFile();
    const existingIdx = list.findIndex((p) => p.id === body.id || p.slug === slug);

    let savedProject: Project;

    if (existingIdx >= 0) {
      savedProject = {
        ...list[existingIdx],
        ...body,
        slug,
        updated_at: now,
        media_items: body.media_items || list[existingIdx].media_items || [],
      };
      list[existingIdx] = savedProject;
    } else {
      savedProject = {
        id: body.id || `proj-${Date.now()}`,
        slug,
        title: body.title,
        category: body.category || '3d',
        description: body.description || '',
        content: body.content || '',
        client: body.client || '',
        year: body.year || new Date().getFullYear().toString(),
        role: body.role || '',
        tools: body.tools || [],
        thumbnail_url: body.thumbnail_url || '/portfolio/3d/monolith-titanium.svg',
        video_preview_url: body.video_preview_url || undefined,
        hero_media_url: body.hero_media_url || body.thumbnail_url || '/portfolio/3d/monolith-titanium.svg',
        hero_media_type: body.hero_media_type || 'image',
        featured: body.featured ?? false,
        show_in_hero: body.show_in_hero ?? false,
        hero_order: body.hero_order ?? list.length + 1,
        published: body.published ?? true,
        sort_order: body.sort_order ?? list.length + 1,
        media_items: body.media_items || [],
        created_at: now,
        updated_at: now,
      };
      list.unshift(savedProject);
    }

    await writeProjectsToFile(list);
    return NextResponse.json(savedProject);
  } catch (error: any) {
    console.error('Save project API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('project_media').delete().eq('project_id', id);
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const list = await readProjectsFromFile();
    const filtered = list.filter((p) => p.id !== id);
    await writeProjectsToFile(filtered);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }

    const list = await readProjectsFromFile();
    const map = new Map(list.map((p) => [p.id, p]));
    const reordered: Project[] = [];

    orderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        item.sort_order = index + 1;
        reordered.push(item);
        map.delete(id);
      }
    });

    map.forEach((item) => reordered.push(item));

    await writeProjectsToFile(reordered);
    return NextResponse.json({ success: true, count: reordered.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reorder' }, { status: 500 });
  }
}


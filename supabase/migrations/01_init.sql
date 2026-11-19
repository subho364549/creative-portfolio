-- ==============================================================================
-- Creative Portfolio Database Migration
-- Target: Supabase Postgres
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('3d', 'video', 'graphics')),
  description TEXT,
  content TEXT,
  client TEXT,
  year TEXT,
  role TEXT,
  tools TEXT[] DEFAULT '{}',
  thumbnail_url TEXT NOT NULL,
  video_preview_url TEXT,
  hero_media_url TEXT NOT NULL,
  hero_media_type TEXT NOT NULL DEFAULT 'image' CHECK (hero_media_type IN ('image', 'video')),
  featured BOOLEAN DEFAULT false,
  show_in_hero BOOLEAN DEFAULT false,
  hero_order INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_show_in_hero ON public.projects(show_in_hero);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

-- 2. Create Project Media Table
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  caption TEXT,
  poster_url TEXT,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON public.project_media(project_id);

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Public visitors can view published projects"
  ON public.projects
  FOR SELECT
  USING (published = true);

-- Authenticated admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admins can insert projects
CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admins can update projects
CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admins can delete projects
CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Media items RLS: Public can view media for published projects
CREATE POLICY "Public can view media for published projects"
  ON public.project_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_media.project_id
        AND projects.published = true
    )
  );

-- Admins full access to media items
CREATE POLICY "Admins full access to project_media"
  ON public.project_media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Storage Bucket Configuration
-- Creates the 'portfolio-media' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public access to download/view portfolio media
CREATE POLICY "Public Media Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Authenticated admin upload access
CREATE POLICY "Admin Media Upload Access"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated admin delete access
CREATE POLICY "Admin Media Delete Access"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');


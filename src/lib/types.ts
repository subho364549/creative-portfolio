export type ProjectCategory = '3d' | 'video' | 'graphics';

export interface MediaItem {
  id: string;
  project_id?: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  poster_url?: string;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  content?: string;
  client?: string;
  year: string;
  role?: string;
  tools: string[];
  thumbnail_url: string;
  video_preview_url?: string;
  hero_media_url: string;
  hero_media_type: 'image' | 'video';
  featured: boolean;
  show_in_hero: boolean;
  hero_order?: number;
  published: boolean;
  sort_order: number;
  media_items: MediaItem[];
  created_at: string;
  updated_at: string;
}

export type CategoryFilter = 'all' | ProjectCategory;

export interface ContactInquiry {
  name: string;
  email: string;
  category: ProjectCategory | 'general';
  budget?: string;
  message: string;
  timeline?: string;
}


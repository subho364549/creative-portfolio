# Subhojit Das — Creative Direction, 3D Visualization & Motion Systems

A production-ready personal creative portfolio website engineered with Next.js 14 App Router, TypeScript, Tailwind CSS, GSAP 3D perspective animations, and Supabase Postgres & Storage.

Inspired by the editorial elegance, oversized media compositions, and sliding-card visual language of reference studios, crafted for high-impact visual representation.

---

## 🌟 Key Features

1. **Floating 3D Perspective Hero Carousel**:
   - Layered rectangular media cards animated with GSAP (`x`, `z`, `rotationY`, `scale`, easing)
   - Active prominent card with visible neighboring cards
   - Full drag, swipe, arrow button, and keyboard arrow controls
   - Auto-play with hover pause and seamless looping
   - Supports both images and muted, looping video preview cards
   - Accessibility: Instant toggle for **Reduced Motion** crossfade alternative
   - Direct click-through to individual project case studies

2. **Categorized Project Archive**:
   - Filter by **All Work**, **3D**, **Video**, and **Graphics**
   - URL-synchronized category state (`/?category=3d`, `/?category=video`, `/?category=graphics`)
   - Smooth animated GSAP filter transitions
   - Video hover playback preview with intersection observer offscreen pausing
   - Fast client-side search across titles, clients, and tools

3. **Individual Project Case Study Pages (`/project/[slug]`)**:
   - Oversized 2.39:1 / 16:9 widescreen hero media
   - Metadata breakdown: Client, Year, Discipline, Role, and Software toolchain
   - Detailed editorial overview and technical pipeline narrative
   - Multi-plate supporting exhibition media gallery with fullscreen zoom lightbox
   - Next and Previous project navigation cards

4. **Protected Admin Management Console (`/admin` & `/admin/dashboard`)**:
   - Supabase Auth gate with instant local demo mode fallback
   - Drag-and-drop multi-file uploader supporting **JPG, PNG, WEBP, MP4, and WEBM**
   - File size validation and upload progress indicators
   - Project editing, publishing/unpublishing, and deletion
   - Quick toggle to feature projects in the **Homepage 3D Hero Slider**
   - Reorder projects (move up / down)
   - "Reset to Sample Data" button for safe experimentation

5. **Aesthetic & Performance**:
   - Deep obsidian / charcoal `#08080a` background with warm white typography
   - Zero layout shifts with pre-configured aspect ratios
   - Modular Supabase storage & Postgres schema with Row Level Security (RLS)

---

## 🚀 Quick Start (Development)

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Where to Replace Sample Images and Videos with Your Own

The portfolio comes pre-configured with local starter assets and can also stream from Supabase Storage:

### Local Assets Directory:
Place your renders, screenshots, and videos directly in:
- `public/portfolio/3d/` — Place your 3D renders (JPG, PNG, WEBP)
- `public/portfolio/video/` — Place your video files (MP4, WEBM) and poster frames
- `public/portfolio/graphics/` — Place your identity systems, typography, and poster graphics

### Option A: Using the Admin Dashboard (Easiest)
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Click **"Instant Demo Access"** (or log in with your Supabase credentials once configured).
3. Click **"Edit"** on any project or click **"+ NEW PROJECT"**.
4. Drag and drop your JPG, PNG, WEBP, MP4, or WEBM files into the uploader.
5. Click **"Save Record"** — the site updates immediately!

### Option B: Editing the Starter Content File
You can also directly customize the project metadata and file paths in:
```
src/lib/sample-data.ts
```
Simply change the `thumbnail_url`, `hero_media_url`, or `video_preview_url` to point to your files in `/portfolio/3d/...`, `/portfolio/video/...`, etc.

---

## 🗄️ Supabase Cloud Integration (Optional but Production-Ready)

The application functions completely out of the box using local starter data. When you are ready to persist to live Supabase:

1. Create a project at [https://supabase.com](https://supabase.com).
2. In your Supabase project dashboard, open the **SQL Editor** on the left menu.
3. Open `supabase/migrations/01_init.sql` from this repository, copy its contents, and run it in the SQL Editor. This automatically sets up:
   - `projects` table
   - `project_media` table
   - `portfolio-media` storage bucket
   - Row-Level Security (RLS) policies allowing public read of published work and authenticated admin control.
4. Copy your **Project URL** and **Anon Public API Key** from **Project Settings → API**.
5. Paste them into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
6. Restart your dev server (`npm run dev`). The dashboard will now automatically persist all projects and media uploads to your live Supabase cloud database!

---

## ☁️ Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. In [Vercel](https://vercel.com), click **Add New Project** and select this repo.
3. Add your environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` (optional if using local demo)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. The site will build and deploy instantly with optimal caching and global CDN delivery.

---

## 🛠️ Tech Stack Architecture

- **Next.js 14** (App Router, Server & Client Components)
- **TypeScript**
- **Tailwind CSS** (Custom dark obsidian palette, glassmorphism, responsive typography)
- **GSAP 3** + `@gsap/react` (Smooth 3D perspective translation, rotation, scale, easing)
- **Supabase** (Postgres DB, Supabase Storage, Auth)
- **Lucide Icons**


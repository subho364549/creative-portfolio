import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
];

const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file format (${file.type || 'unknown'}). Allowed: JPG, PNG, WEBP, MP4, WEBM.`,
        },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit: ${
            isVideo ? '150MB' : '25MB'
          }.`,
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 1. If Supabase is configured, upload to Supabase Storage
    if (isSupabaseConfigured() && supabase) {
      try {
        const storagePath = `${category}/${cleanName}`;
        const { data, error } = await supabase.storage
          .from('portfolio-media')
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('portfolio-media')
            .getPublicUrl(storagePath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            type: isVideo ? 'video' : 'image',
            name: file.name,
            size: file.size,
            storage: 'supabase',
          });
        } else {
          console.warn('Supabase storage upload error, saving locally:', error);
        }
      } catch (err) {
        console.warn('Supabase storage error, falling back to local file system:', err);
      }
    }

    // 2. Local File System Storage: Save permanently in public/uploads/<category>/
    const targetDir = path.join(process.cwd(), 'public', 'uploads', category);
    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, cleanName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${category}/${cleanName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      type: isVideo ? 'video' : 'image',
      name: file.name,
      size: file.size,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}


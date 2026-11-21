import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return new NextResponse('Missing video path', { status: 400 });
  }

  // Sanitize path to prevent directory traversal
  const cleanPath = path.replace(/^\/+/, '').replace(/\.\.\//g, '');
  const githubLfsUrl = `https://media.githubusercontent.com/media/subho364549/creative-portfolio/main/public/${cleanPath}`;

  const range = request.headers.get('range');
  const headers: Record<string, string> = {};
  if (range) {
    headers['Range'] = range;
  }

  try {
    const upstreamRes = await fetch(githubLfsUrl, {
      headers,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return new NextResponse(`Video not found on storage: ${upstreamRes.statusText}`, {
        status: upstreamRes.status,
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    const contentLength = upstreamRes.headers.get('content-length');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);

    const contentRange = upstreamRes.headers.get('content-range');
    if (contentRange) responseHeaders.set('Content-Range', contentRange);

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new NextResponse(`Error proxying video: ${err.message}`, { status: 500 });
  }
}

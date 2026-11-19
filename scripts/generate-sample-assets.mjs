import fs from 'fs';
import path from 'path';

const assets = [
  // 3D Visualizations
  {
    path: 'public/portfolio/3d/monolith-titanium.svg',
    title: 'MONOLITH 01',
    subtitle: 'Octane Render • Titanium & Obsidian',
    bg1: '#0d0d12',
    bg2: '#181822',
    accent: '#8b9bb4',
    accent2: '#4a5568',
    geometry: `
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3a3d52" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#161722" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#090a0f" stop-opacity="1"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="960" cy="540" r="450" fill="url(#glow)"/>
      <polygon points="960,180 1340,380 1340,780 960,980 580,780 580,380" fill="url(#grad1)" stroke="#64748b" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="960" y1="180" x2="960" y2="980" stroke="#94a3b8" stroke-width="3" stroke-opacity="0.6"/>
      <line x1="580" y1="380" x2="1340" y2="780" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.5"/>
      <line x1="580" y1="780" x2="1340" y2="380" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.5"/>
      <!-- Inner core -->
      <polygon points="960,340 1180,470 1180,720 960,820 740,720 740,470" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.7"/>
    `
  },
  {
    path: 'public/portfolio/3d/subsurface-glass.svg',
    title: 'REFRACTIVE FLUID',
    subtitle: 'Cinema 4D • Redshift Subsurface Scattering',
    bg1: '#0a0d14',
    bg2: '#121c2e',
    accent: '#38bdf8',
    accent2: '#818cf8',
    geometry: `
      <defs>
        <linearGradient id="glassGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7"/>
          <stop offset="40%" stop-color="#818cf8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <circle cx="800" cy="500" r="320" fill="url(#glassGrad)" filter="drop-shadow(0 0 40px rgba(56,189,248,0.3))"/>
      <circle cx="1120" cy="580" r="260" fill="none" stroke="#c084fc" stroke-width="3" stroke-opacity="0.6"/>
      <circle cx="960" cy="540" r="180" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,8"/>
      <path d="M 600,600 Q 960,200 1320,600 T 1600,700" fill="none" stroke="#e0e7ff" stroke-width="2" stroke-opacity="0.5"/>
    `
  },
  {
    path: 'public/portfolio/3d/kinetic-sculpture.svg',
    title: 'AERODYNAMIC FORM',
    subtitle: 'Blender 4.2 • Procedural Geometry Nodes',
    bg1: '#111015',
    bg2: '#1d1726',
    accent: '#e879f9',
    accent2: '#f43f5e',
    geometry: `
      <defs>
        <radialGradient id="sculptureGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="960" cy="540" r="500" fill="url(#sculptureGlow)"/>
      <ellipse cx="960" cy="540" rx="420" ry="180" fill="none" stroke="#f43f5e" stroke-width="2" transform="rotate(-25 960 540)" stroke-opacity="0.7"/>
      <ellipse cx="960" cy="540" rx="420" ry="180" fill="none" stroke="#c084fc" stroke-width="2" transform="rotate(35 960 540)" stroke-opacity="0.7"/>
      <ellipse cx="960" cy="540" rx="420" ry="180" fill="none" stroke="#e2e8f0" stroke-width="1.5" transform="rotate(95 960 540)" stroke-opacity="0.5"/>
    `
  },
  {
    path: 'public/portfolio/3d/chromatic-fluid.svg',
    title: 'CHROMATIC DISPERSION',
    subtitle: 'Houdini • Vellum Fluid Simulation',
    bg1: '#070b12',
    bg2: '#0e1828',
    accent: '#2dd4bf',
    accent2: '#3b82f6',
    geometry: `
      <path d="M 400,500 C 600,200 800,800 1100,400 S 1500,700 1600,450" fill="none" stroke="#2dd4bf" stroke-width="4" stroke-opacity="0.8"/>
      <path d="M 420,530 C 620,230 820,830 1120,430 S 1520,730 1620,480" fill="none" stroke="#3b82f6" stroke-width="3" stroke-opacity="0.6"/>
      <path d="M 440,560 C 640,260 840,860 1140,460 S 1540,760 1640,510" fill="none" stroke="#a855f7" stroke-width="2" stroke-opacity="0.5"/>
    `
  },

  // Video & Motion
  {
    path: 'public/portfolio/video/astral-cinematic.svg',
    title: 'ASTRAL FREQUENCIES',
    subtitle: 'Brand Film & Soundscape • Arri Alexa 35',
    bg1: '#060608',
    bg2: '#14141d',
    accent: '#fbbf24',
    accent2: '#f59e0b',
    geometry: `
      <circle cx="960" cy="540" r="280" fill="none" stroke="#fbbf24" stroke-width="2" stroke-opacity="0.8"/>
      <circle cx="960" cy="540" r="300" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="3,12" stroke-opacity="0.5"/>
      <circle cx="960" cy="540" r="40" fill="#fbbf24" fill-opacity="0.8"/>
      <line x1="200" y1="540" x2="1720" y2="540" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.4"/>
      <!-- 2.39:1 letterbox guides -->
      <line x1="100" y1="140" x2="1820" y2="140" stroke="#334155" stroke-width="1" stroke-dasharray="10,10"/>
      <line x1="100" y1="940" x2="1820" y2="940" stroke="#334155" stroke-width="1" stroke-dasharray="10,10"/>
    `
  },
  {
    path: 'public/portfolio/video/noir-motion.svg',
    title: 'NOIR SYNTHESIS',
    subtitle: 'Experimental Short • High Contrast Monochrome',
    bg1: '#050505',
    bg2: '#111111',
    accent: '#ffffff',
    accent2: '#71717a',
    geometry: `
      <rect x="760" y="240" width="400" height="600" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
      <rect x="790" y="270" width="340" height="540" fill="#ffffff" fill-opacity="0.08"/>
      <line x1="960" y1="100" x2="960" y2="980" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/>
      <circle cx="960" cy="540" r="160" fill="none" stroke="#a1a1aa" stroke-width="1" stroke-dasharray="8,8"/>
    `
  },
  {
    path: 'public/portfolio/video/spatial-soundscape.svg',
    title: 'SPECTRUM 09',
    subtitle: 'Music Visualizer • Real-Time Audio Reactive',
    bg1: '#080d12',
    bg2: '#0e1d24',
    accent: '#06b6d4',
    accent2: '#10b981',
    geometry: `
      <defs>
        <linearGradient id="spectrumWave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="50%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <path d="M 200,540 Q 400,240 600,540 T 1000,540 T 1400,540 T 1720,540" fill="none" stroke="url(#spectrumWave)" stroke-width="4" stroke-opacity="0.9"/>
      <path d="M 200,540 Q 450,780 700,540 T 1200,540 T 1720,540" fill="none" stroke="#06b6d4" stroke-width="2" stroke-opacity="0.4"/>
    `
  },
  {
    path: 'public/portfolio/video/tokyo-nocturne.svg',
    title: 'NEON HORIZON',
    subtitle: 'Commercial Sequence • Anamorphic Primes',
    bg1: '#130919',
    bg2: '#230e2f',
    accent: '#ec4899',
    accent2: '#8b5cf6',
    geometry: `
      <polygon points="960,200 1460,880 460,880" fill="none" stroke="#ec4899" stroke-width="3" stroke-opacity="0.8"/>
      <polygon points="960,320 1340,840 580,840" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="6,6" stroke-opacity="0.6"/>
      <line x1="300" y1="880" x2="1620" y2="880" stroke="#f472b6" stroke-width="2" stroke-opacity="0.5"/>
    `
  },

  // Graphic Design
  {
    path: 'public/portfolio/graphics/bauhaus-modern.svg',
    title: 'NEO TYPOGRAPHIC SYSTEM',
    subtitle: 'Grid & Identity • International Typographic Style',
    bg1: '#09090b',
    bg2: '#18181b',
    accent: '#f43f5e',
    accent2: '#f59e0b',
    geometry: `
      <rect x="500" y="260" width="320" height="320" fill="#f43f5e" fill-opacity="0.85"/>
      <circle cx="1180" cy="420" r="160" fill="#f59e0b" fill-opacity="0.85"/>
      <polygon points="960,600 1280,880 640,880" fill="#3b82f6" fill-opacity="0.75"/>
      <line x1="400" y1="200" x2="400" y2="920" stroke="#71717a" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="960" y1="100" x2="960" y2="980" stroke="#71717a" stroke-width="1" stroke-dasharray="4,4"/>
      <line x1="1520" y1="200" x2="1520" y2="920" stroke="#71717a" stroke-width="1" stroke-dasharray="4,4"/>
    `
  },
  {
    path: 'public/portfolio/graphics/monograph-identity.svg',
    title: 'AESTHETIC ARCHIVE',
    subtitle: 'Monograph & Brand Architecture',
    bg1: '#0d0d0f',
    bg2: '#1a1a20',
    accent: '#d4af37',
    accent2: '#e2e8f0',
    geometry: `
      <rect x="680" y="240" width="560" height="600" rx="4" fill="none" stroke="#d4af37" stroke-width="2" stroke-opacity="0.8"/>
      <rect x="740" y="300" width="440" height="480" fill="#d4af37" fill-opacity="0.06"/>
      <line x1="740" y1="540" x2="1180" y2="540" stroke="#d4af37" stroke-width="1" stroke-opacity="0.5"/>
      <text x="960" y="520" font-family="serif" font-size="28" fill="#f7f6f2" text-anchor="middle" letter-spacing="8">STUDIO EDITION</text>
    `
  },
  {
    path: 'public/portfolio/graphics/swiss-editorial.svg',
    title: 'EDITORIAL ARCHITECTURE',
    subtitle: 'Quarterly Journal • Custom Grid System',
    bg1: '#08080a',
    bg2: '#121217',
    accent: '#38bdf8',
    accent2: '#f8fafc',
    geometry: `
      <g stroke="#334155" stroke-width="1" opacity="0.4">
        <line x1="300" y1="200" x2="300" y2="880"/>
        <line x1="630" y1="200" x2="630" y2="880"/>
        <line x1="960" y1="200" x2="960" y2="880"/>
        <line x1="1290" y1="200" x2="1290" y2="880"/>
        <line x1="1620" y1="200" x2="1620" y2="880"/>
      </g>
      <rect x="630" y="320" width="660" height="380" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-width="1.5"/>
    `
  },
  {
    path: 'public/portfolio/graphics/brutalist-poster.svg',
    title: 'RAW CONCRETE & TYPE',
    subtitle: 'Exhibition Poster Series • Custom Glyph Foundry',
    bg1: '#0c0c0e',
    bg2: '#1b1b1e',
    accent: '#fb923c',
    accent2: '#f97316',
    geometry: `
      <text x="960" y="440" font-family="sans-serif" font-weight="900" font-size="160" fill="#f4f4f5" text-anchor="middle" letter-spacing="-6" opacity="0.9">FORM</text>
      <text x="960" y="580" font-family="sans-serif" font-weight="900" font-size="160" fill="#fb923c" text-anchor="middle" letter-spacing="-6" opacity="0.9">SHIFT</text>
      <line x1="400" y1="680" x2="1520" y2="680" stroke="#f97316" stroke-width="4"/>
    `
  }
];

function generateSVG(item) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.bg1}"/>
      <stop offset="100%" stop-color="${item.bg2}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="40%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
    </radialGradient>
    <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.04"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#gridPattern)"/>

  <!-- Geometry Artwork -->
  ${item.geometry}

  <!-- Vignette -->
  <rect width="1920" height="1080" fill="url(#vignette)"/>

  <!-- Editorial Meta Overlay -->
  <g id="editorial-meta">
    <!-- Top Bar -->
    <text x="120" y="120" font-family="monospace" font-size="14" fill="#a1a1aa" letter-spacing="4">PORTFOLIO // ARCHIVE</text>
    <text x="1800" y="120" font-family="monospace" font-size="14" fill="#a1a1aa" text-anchor="end" letter-spacing="4">RES. 4K • COLOR REC.709</text>

    <!-- Bottom Editorial Title -->
    <text x="120" y="940" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="52" fill="#f4f4f2" letter-spacing="-1">${item.title}</text>
    <text x="120" y="985" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="20" fill="#94a3b8" letter-spacing="1">${item.subtitle}</text>

    <!-- Minimal badge -->
    <rect x="1680" y="920" width="120" height="38" rx="4" fill="#000000" fill-opacity="0.6" stroke="#ffffff" stroke-width="1" stroke-opacity="0.2"/>
    <text x="1740" y="945" font-family="monospace" font-size="13" fill="#e2e8f0" text-anchor="middle" letter-spacing="2">STUDIO</text>
  </g>
</svg>`;
}

for (const asset of assets) {
  const dir = path.dirname(asset.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(asset.path, generateSVG(asset), 'utf8');
  console.log(`Generated: ${asset.path}`);
}
console.log('All sample visual assets created successfully.');


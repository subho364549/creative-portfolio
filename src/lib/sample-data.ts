import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    slug: 'monolith-titanium',
    title: 'Monolith: Spatial Architecture',
    category: '3d',
    description: 'An architectural meditation on monolithic mass, titanium surfacing, and brutalist geometric forms bathed in directional studio lighting.',
    content: `
# Architectural Mass & Materiality

Monolith explores the interplay between raw material density and pristine geometric discipline. Rendered in Octane Render with Cinema 4D, each facet was constructed using procedural displacement algorithms to simulate micro-abrasions in blackened aerospace titanium.

### Creative Direction
The goal was to strip away unnecessary decorative flourishes and investigate how monolithic volumes sculpt negative space. Volumetric atmospheric fog introduces depth while glancing rim lights accentuate the precision chamfers.

### Technical Breakdown
- **Geometry**: Procedural parametric meshes modeled in Cinema 4D
- **Shading**: Multi-layered physically-based materials with anisotropy and micro-roughness maps
- **Lighting**: HDRI studio rigs augmented by narrow-angle custom spotlights
    `,
    client: 'Apex Spatial Laboratory',
    year: '2025',
    role: 'Art Director & 3D Artist',
    tools: ['Cinema 4D', 'Octane Render', 'ZBrush', 'Photoshop'],
    thumbnail_url: '/portfolio/3d/monolith-titanium.svg',
    hero_media_url: '/portfolio/3d/monolith-titanium.svg',
    hero_media_type: 'image',
    featured: true,
    show_in_hero: true,
    hero_order: 1,
    published: true,
    sort_order: 1,
    media_items: [
      {
        id: 'm-1-1',
        url: '/portfolio/3d/monolith-titanium.svg',
        type: 'image',
        caption: 'Isometric primary perspective with titanium brushed sheen',
        sort_order: 1
      },
      {
        id: 'm-1-2',
        url: '/portfolio/3d/subsurface-glass.svg',
        type: 'image',
        caption: 'Refractive inner lattice structure',
        sort_order: 2
      }
    ],
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'proj-02',
    slug: 'astral-frequencies',
    title: 'Astral Frequencies',
    category: 'video',
    description: 'A 2.39:1 widescreen cinematic short capturing hypersonic velocity, ambient celestial frequencies, and atmospheric distortion.',
    content: `
# Sensory Resonance & Cinematic Soundscapes

Commissioned as a multi-sensory brand anthem, Astral Frequencies bridges astronomical physics and contemporary sound design. Shot on Arri Alexa 35 with custom anamorphic glass and treated with analog grain emulation.

### Thematic Exploration
The piece develops across three continuous movements: Ignition, Orbit, and Dissolution. Each movement is synchronized with high-precision sub-bass pulses and dynamic particle bursts.

### Motion Pipeline
- **Filtration**: 1/4 Black Pro-Mist with anamorphic horizontal flare streaks
- **Grading**: Custom Kodak 2383 print emulation LUT in DaVinci Resolve
- **Audio Integration**: 7.1 spatial mix mastered for high-fidelity headphone immersion
    `,
    client: 'Vanguard Sound Labs',
    year: '2025',
    role: 'Director, Cinematographer & Editor',
    tools: ['Arri Alexa 35', 'DaVinci Resolve', 'After Effects', 'Premiere Pro'],
    thumbnail_url: '/portfolio/video/astral-cinematic.svg',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41484-large.mp4',
    hero_media_url: '/portfolio/video/astral-cinematic.svg',
    hero_media_type: 'video',
    featured: true,
    show_in_hero: true,
    hero_order: 2,
    published: true,
    sort_order: 2,
    media_items: [
      {
        id: 'm-2-1',
        url: '/portfolio/video/astral-cinematic.svg',
        type: 'video',
        poster_url: '/portfolio/video/astral-cinematic.svg',
        caption: 'Master 4K sequence with anamorphic aspect ratio',
        sort_order: 1
      },
      {
        id: 'm-2-2',
        url: '/portfolio/video/spatial-soundscape.svg',
        type: 'image',
        caption: 'Audio frequency visual wave analysis',
        sort_order: 2
      }
    ],
    created_at: '2025-02-10T12:00:00Z',
    updated_at: '2025-02-10T12:00:00Z'
  },
  {
    id: 'proj-03',
    slug: 'neo-typographic-system',
    title: 'Neo Typographic System',
    category: 'graphics',
    description: 'A mathematical 12-column grid system exploring variable letterforms, high-contrast grotesques, and radical Swiss editorial layouts.',
    content: `
# Systematic Rigor & Editorial Avant-Garde

Inspired by the Ulm School of Design and modern algorithmic layout engines, this visual identity investigates how rigid grid structures can generate expressive typographic tension.

### Design Principles
Every element aligns strictly to an 8pt baseline grid. Variable weight interpolations allow headings to breathe dynamically between ultra-compressed weights and expansive display forms.

### Applications
- **Monograph Publication**: 240-page clothbound hardback with dual spot fluorescent inks
- **Digital Interactive Canvas**: WebGL typographic simulator allowing users to manipulate kinetic character kerning in real time
    `,
    client: 'Zurich Design Biennale',
    year: '2024',
    role: 'Principal Graphic Designer',
    tools: ['Figma', 'Illustrator', 'InDesign', 'Glyphs 3'],
    thumbnail_url: '/portfolio/graphics/bauhaus-modern.svg',
    hero_media_url: '/portfolio/graphics/bauhaus-modern.svg',
    hero_media_type: 'image',
    featured: true,
    show_in_hero: true,
    hero_order: 3,
    published: true,
    sort_order: 3,
    media_items: [
      {
        id: 'm-3-1',
        url: '/portfolio/graphics/bauhaus-modern.svg',
        type: 'image',
        caption: 'Core geometric brand identity key visual',
        sort_order: 1
      },
      {
        id: 'm-3-2',
        url: '/portfolio/graphics/swiss-editorial.svg',
        type: 'image',
        caption: 'Editorial spread showing baseline grid system',
        sort_order: 2
      }
    ],
    created_at: '2024-11-20T14:30:00Z',
    updated_at: '2024-11-20T14:30:00Z'
  },
  {
    id: 'proj-04',
    slug: 'refractive-fluid',
    title: 'Refractive Fluid & Dispersion',
    category: '3d',
    description: 'High-index optical glass simulations interacting with spectral chromatic aberration and subsurface light transmission.',
    content: `
# Light Transmission & Caustic Algorithms

Simulating real-world photon refraction through dense quartz crystal. Using GPU-accelerated path tracing in Redshift to capture subtle rainbow dispersion along curvature edges.
    `,
    client: 'Prism Optics Co.',
    year: '2025',
    role: '3D LookDev Artist',
    tools: ['Cinema 4D', 'Redshift', 'Houdini'],
    thumbnail_url: '/portfolio/3d/subsurface-glass.svg',
    hero_media_url: '/portfolio/3d/subsurface-glass.svg',
    hero_media_type: 'image',
    featured: true,
    show_in_hero: true,
    hero_order: 4,
    published: true,
    sort_order: 4,
    media_items: [
      {
        id: 'm-4-1',
        url: '/portfolio/3d/subsurface-glass.svg',
        type: 'image',
        caption: 'Caustic dispersion pass with 1.58 IOR glass',
        sort_order: 1
      }
    ],
    created_at: '2025-03-01T09:15:00Z',
    updated_at: '2025-03-01T09:15:00Z'
  },
  {
    id: 'proj-05',
    slug: 'noir-synthesis',
    title: 'Noir Synthesis: Kinetic Film',
    category: 'video',
    description: 'An experimental black-and-white motion study highlighting stark shadow silhouettes, analog grain, and rapid kinetic montage.',
    content: `
# High-Contrast Monochrome & Visual Rhythm

Examining the purity of light versus darkness without color distraction. Rendered through analog CRT monitors and scanned back to 4K digital negative.
    `,
    client: 'Film Collective Noir',
    year: '2024',
    role: 'Motion Designer & Colorist',
    tools: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
    thumbnail_url: '/portfolio/video/noir-motion.svg',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31911-large.mp4',
    hero_media_url: '/portfolio/video/noir-motion.svg',
    hero_media_type: 'video',
    featured: false,
    show_in_hero: false,
    published: true,
    sort_order: 5,
    media_items: [
      {
        id: 'm-5-1',
        url: '/portfolio/video/noir-motion.svg',
        type: 'video',
        poster_url: '/portfolio/video/noir-motion.svg',
        caption: '35mm high-contrast scan composite',
        sort_order: 1
      }
    ],
    created_at: '2024-09-12T16:00:00Z',
    updated_at: '2024-09-12T16:00:00Z'
  },
  {
    id: 'proj-06',
    slug: 'aerodynamic-form',
    title: 'Aerodynamic Form: Geometry Nodes',
    category: '3d',
    description: 'Procedurally generated aerodynamic curves capturing mathematical air flow velocity in virtual wind tunnels.',
    content: `
# Mathematical Streamlines & Velocity Vectors

Built entirely within Blender 4.2 using geometry node trees with vector math operations controlling spline curvature, tapering, and particle distribution.
    `,
    client: 'Aero Dynamics Institute',
    year: '2025',
    role: 'Procedural 3D Designer',
    tools: ['Blender 4.2', 'Cycles', 'After Effects'],
    thumbnail_url: '/portfolio/3d/kinetic-sculpture.svg',
    hero_media_url: '/portfolio/3d/kinetic-sculpture.svg',
    hero_media_type: 'image',
    featured: true,
    show_in_hero: true,
    hero_order: 5,
    published: true,
    sort_order: 6,
    media_items: [
      {
        id: 'm-6-1',
        url: '/portfolio/3d/kinetic-sculpture.svg',
        type: 'image',
        caption: 'Calculated wind-tunnel airflow vectors',
        sort_order: 1
      }
    ],
    created_at: '2025-02-28T11:00:00Z',
    updated_at: '2025-02-28T11:00:00Z'
  },
  {
    id: 'proj-07',
    slug: 'aesthetic-archive-monograph',
    title: 'Aesthetic Archive: Studio Monograph',
    category: 'graphics',
    description: 'Comprehensive archival publication, tactile packaging, gold leaf foil stamping, and minimal typography system.',
    content: `
# Physical Mediums & Tactile Finishes

A celebration of print craft. Printed on 160gsm Fedrigoni Sirio Ultra Black paper with micro-embossed metallic foils and lay-flat Swiss binding.
    `,
    client: 'Atelier Editions',
    year: '2024',
    role: 'Editorial Director & Book Designer',
    tools: ['InDesign', 'Illustrator', 'Photoshop'],
    thumbnail_url: '/portfolio/graphics/monograph-identity.svg',
    hero_media_url: '/portfolio/graphics/monograph-identity.svg',
    hero_media_type: 'image',
    featured: false,
    show_in_hero: false,
    published: true,
    sort_order: 7,
    media_items: [
      {
        id: 'm-7-1',
        url: '/portfolio/graphics/monograph-identity.svg',
        type: 'image',
        caption: 'Debossed gold foil cover details',
        sort_order: 1
      }
    ],
    created_at: '2024-08-05T13:20:00Z',
    updated_at: '2024-08-05T13:20:00Z'
  },
  {
    id: 'proj-08',
    slug: 'neon-horizon',
    title: 'Neon Horizon: Commercial Sequence',
    category: 'video',
    description: 'Dynamic neon lighting, retro-futuristic camera sweeps, and pulsating synthesizer rhythm for a global campaign.',
    content: `
# Retro-Futurism & Anamorphic Color Grading

Combining practical miniature sets with digital CG extensions to create an immersive nocturnal metropolis drenched in rain and magenta neon reflections.
    `,
    client: 'Cyberpulse Audio',
    year: '2025',
    role: 'VFX Supervisor & Colorist',
    tools: ['Cinema 4D', 'After Effects', 'Unreal Engine 5'],
    thumbnail_url: '/portfolio/video/tokyo-nocturne.svg',
    video_preview_url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    hero_media_url: '/portfolio/video/tokyo-nocturne.svg',
    hero_media_type: 'video',
    featured: true,
    show_in_hero: false,
    published: true,
    sort_order: 8,
    media_items: [
      {
        id: 'm-8-1',
        url: '/portfolio/video/tokyo-nocturne.svg',
        type: 'video',
        poster_url: '/portfolio/video/tokyo-nocturne.svg',
        caption: 'Night cityscape motion grade',
        sort_order: 1
      }
    ],
    created_at: '2025-01-28T18:00:00Z',
    updated_at: '2025-01-28T18:00:00Z'
  },
  {
    id: 'proj-09',
    slug: 'chromatic-dispersion',
    title: 'Chromatic Dispersion & Fluidity',
    category: '3d',
    description: 'Dynamic particle fluids colliding with electromagnetic force fields in Houdini Vellum simulations.',
    content: `
# Multi-Million Particle Physics Simulations

Detailed micro-surface tension and rainbow light transmission rendered using custom shader networks with physical index of refraction shifts.
    `,
    client: 'Quantum Materials Lab',
    year: '2025',
    role: 'Houdini FX Artist',
    tools: ['Houdini', 'Mantra', 'Nuke'],
    thumbnail_url: '/portfolio/3d/chromatic-fluid.svg',
    hero_media_url: '/portfolio/3d/chromatic-fluid.svg',
    hero_media_type: 'image',
    featured: false,
    show_in_hero: false,
    published: true,
    sort_order: 9,
    media_items: [
      {
        id: 'm-9-1',
        url: '/portfolio/3d/chromatic-fluid.svg',
        type: 'image',
        caption: 'High-viscosity fluid dynamic mesh',
        sort_order: 1
      }
    ],
    created_at: '2025-03-10T15:45:00Z',
    updated_at: '2025-03-10T15:45:00Z'
  },
  {
    id: 'proj-10',
    slug: 'raw-concrete-type',
    title: 'Raw Concrete & Monumental Type',
    category: 'graphics',
    description: 'Brutalist exhibition identity, screen-printed typography on architectural concrete slabs and large-format pasteups.',
    content: `
# Monumental Scale & Tactile Brutalism

A tribute to modernism, heavy typography, and industrial textures. Custom type glyphs were laser cut into wood and hand stamped onto raw fiberboard.
    `,
    client: 'Metropolitan Architecture Center',
    year: '2024',
    role: 'Creative Director',
    tools: ['Illustrator', 'Screen Printing', 'Photoshop'],
    thumbnail_url: '/portfolio/graphics/brutalist-poster.svg',
    hero_media_url: '/portfolio/graphics/brutalist-poster.svg',
    hero_media_type: 'image',
    featured: false,
    show_in_hero: false,
    published: true,
    sort_order: 10,
    media_items: [
      {
        id: 'm-10-1',
        url: '/portfolio/graphics/brutalist-poster.svg',
        type: 'image',
        caption: 'Silkscreen poster 01: Form & Structure',
        sort_order: 1
      }
    ],
    created_at: '2024-07-22T08:30:00Z',
    updated_at: '2024-07-22T08:30:00Z'
  }
];


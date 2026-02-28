import type { ResumeTemplate } from '@/types';

export const TEMPLATES: ResumeTemplate[] = [
  // ── 1. MEREDITH — Monogram + giant surname, thin left sidebar ──────────────
  {
    id: 'meredith',
    name: 'Meredith',
    description: 'Monogram initials, full-bleed last name header, editorial sidebar.',
    highlights: ['Monogram header', 'Editorial', 'Designer & UX'],
    typography: {
      heading: 'text-[52px]',
      body: 'text-[13px]',
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'meredith',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#1a1a2e',
      muted: '#6b7280',
      background: '#ffffff',
      accent: '#b8d4d4',
      sidebarBg: '#f9f9f9',
      sidebarText: '#1a1a2e',
      highlight: '#b8d4d4'
    }
  },

  // ── 2. CHARLIE — Dark card, photo left, experience right ───────────────────
  {
    id: 'charlie',
    name: 'Charlie',
    description: 'Dark card UI with photo panel and clean experience timeline.',
    highlights: ['Dark UI', 'Photo card', 'Portfolio-grade'],
    typography: {
      heading: 'text-[28px]',
      body: 'text-[13px]',
      headingFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'charlie',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#f1f5f9',
      muted: '#94a3b8',
      background: '#141414',
      accent: '#1f2937',
      sidebarBg: '#1c1c1c',
      sidebarText: '#f1f5f9',
      highlight: '#ffffff'
    }
  },

  // ── 3. FIA — Creative editorial, big greeting, date-dot timeline ────────────
  {
    id: 'fia',
    name: 'Fia',
    description: 'Editorial creative: bold greeting, accent circle, timeline dots.',
    highlights: ['Creative portfolio', 'Yellow accent', 'Freelancer & designer'],
    typography: {
      heading: 'text-[54px]',
      body: 'text-[13px]',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Lato', sans-serif"
    },
    spacing: 'space-y-6',
    layout: 'fia',
    sectionStyle: 'dot',
    colors: {
      primary: '#111111',
      muted: '#6b7280',
      background: '#ffffff',
      accent: '#f5c518',
      highlight: '#f5c518'
    }
  },

  // ── 4. HAMPTONE — Role label, huge name, circle photo, two col ─────────────
  {
    id: 'hamptone',
    name: 'Hamptone',
    description: 'Minimal large name, circle photo top-right, structured two columns.',
    highlights: ['ATS friendly', 'Executive clean', 'Circle photo'],
    typography: {
      heading: 'text-[56px]',
      body: 'text-[13px]',
      headingFont: "'EB Garamond', serif",
      bodyFont: "'EB Garamond', serif"
    },
    spacing: 'space-y-4',
    layout: 'hamptone',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#1a1a1a',
      muted: '#6b7280',
      background: '#ffffff',
      accent: '#1a1a1a'
    }
  },

  // ── 5. ETHAN — Dense two-col, colored companies, progress bars ─────────────
  {
    id: 'ethan',
    name: 'Ethan',
    description: 'Power-packed two-column with achievements, skills, language bars.',
    highlights: ['Info-dense', 'Achievements panel', 'Language bars'],
    typography: {
      heading: 'text-[38px]',
      body: 'text-[12.5px]',
      headingFont: "'Syne', sans-serif",
      bodyFont: "'Inter', sans-serif"
    },
    spacing: 'space-y-4',
    layout: 'ethan',
    sectionStyle: 'bar',
    colors: {
      primary: '#0f172a',
      muted: '#475569',
      background: '#ffffff',
      accent: '#0f172a',
      highlight: '#2563eb'
    }
  },

  // ── 6. OBSIDIAN — Dark centered header, gold pills ─────────────────────────
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Dark luxury canvas with gold accents and centered header.',
    highlights: ['Dark luxury', 'C-suite', 'Centered header'],
    typography: {
      heading: 'text-[40px]',
      body: 'text-[13px]',
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-6',
    layout: 'centered-header',
    sectionStyle: 'pill',
    colors: {
      primary: '#d4a853',
      muted: '#94a3b8',
      background: '#0d1117',
      accent: '#d4a853',
      headerBg: '#0d1117',
      headerText: '#f8fafc'
    }
  },

  // ── 7. CARDINAL — Bold red left sidebar panel ──────────────────────────────
  {
    id: 'cardinal',
    name: 'Cardinal',
    description: 'Rich red sidebar panel with white main content. Sharp and confident.',
    highlights: ['Colored sidebar', 'Bold accent', 'Tech & finance'],
    typography: {
      heading: 'text-[30px]',
      body: 'text-[13px]',
      headingFont: "'Plus Jakarta Sans', sans-serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'sidebar-left',
    sectionStyle: 'dot',
    colors: {
      primary: '#ffffff',
      muted: '#fecdd3',
      background: '#ffffff',
      accent: '#be123c',
      sidebarBg: '#be123c',
      sidebarText: '#ffffff',
      highlight: '#be123c'
    }
  },

  // ── 8. TIDAL — Full indigo top banner, two-col body ────────────────────────
  {
    id: 'tidal',
    name: 'Tidal',
    description: 'Full-width deep indigo banner, structured two-column body.',
    highlights: ['Top banner', 'Product & PM', 'Bold header'],
    typography: {
      heading: 'text-[36px]',
      body: 'text-[13px]',
      headingFont: "'Syne', sans-serif",
      bodyFont: "'Inter', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'top-banner',
    sectionStyle: 'underline',
    colors: {
      primary: '#3730a3',
      muted: '#64748b',
      background: '#ffffff',
      accent: '#eef2ff',
      headerBg: '#1e1b4b',
      headerText: '#ffffff',
      highlight: '#4338ca'
    }
  },

  // ── 9. PURITY — Ultra minimal single column, ATS king ─────────────────────
  {
    id: 'purity',
    name: 'Purity',
    description: 'Pure minimal ATS-safe layout. Every word earns its place.',
    highlights: ['ATS #1', 'Zero noise', 'Universal'],
    typography: {
      heading: 'text-[44px]',
      body: 'text-[13.5px]',
      headingFont: "'DM Sans', sans-serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'single-column',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#111827',
      muted: '#6b7280',
      background: '#ffffff',
      accent: '#111827'
    }
  },

  // ── 10. GLACIER — Ice blue sidebar, clean engineering layout ───────────────
  {
    id: 'glacier',
    name: 'Glacier',
    description: 'Cool ice-blue sidebar panel with precise engineering layout.',
    highlights: ['SWE & data', 'Blue sidebar', 'Clean structure'],
    typography: {
      heading: 'text-[28px]',
      body: 'text-[13px]',
      headingFont: "'IBM Plex Sans', sans-serif",
      bodyFont: "'IBM Plex Sans', sans-serif"
    },
    spacing: 'space-y-4',
    layout: 'sidebar-left',
    sectionStyle: 'bar',
    colors: {
      primary: '#f0f9ff',
      muted: '#bae6fd',
      background: '#ffffff',
      accent: '#0369a1',
      sidebarBg: '#0c4a6e',
      sidebarText: '#f0f9ff',
      highlight: '#38bdf8'
    }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ── NEW PREMIUM THEMES 11–20 ───────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // ── 11. NOIR ──────────────────────────────────────────────────────────────
  // Pitch-black canvas (#0a0a0a) + electric lime (#e8ff48) section bars.
  // Syne at 48px = absolute brutalist punch. bar sectionStyle = neon bars
  // on black. For creative directors, art directors, senior designers.
  {
    id: 'noir',
    name: 'Noir',
    description: 'Pitch-black canvas, electric lime accents. Brutal and unforgettable.',
    highlights: ['Dark brutalist', 'Electric lime', 'Creative director'],
    typography: {
      heading: 'text-[48px]',
      body: 'text-[13px]',
      headingFont: "'Syne', sans-serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-6',
    layout: 'single-column',
    sectionStyle: 'bar',
    colors: {
      primary: '#e8ff48',
      muted: '#6b6b6b',
      background: '#0a0a0a',
      accent: '#e8ff48',
      highlight: '#e8ff48'
    }
  },

  // ── 12. AURORA ────────────────────────────────────────────────────────────
  // Deep forest sidebar (#1c3a2a) + warm cream body (#fef9f0).
  // Cormorant Garamond + Lato = organic authority. dot markers = botanical.
  // Sustainability roles, NGOs, environmental consulting.
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Deep forest sidebar, warm cream body. Organic and grounded.',
    highlights: ['Nature palette', 'Warm cream', 'Sustainability & NGO'],
    typography: {
      heading: 'text-[32px]',
      body: 'text-[13px]',
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'Lato', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'sidebar-left',
    sectionStyle: 'dot',
    colors: {
      primary: '#fef9f0',
      muted: '#d4c5aa',
      background: '#fef9f0',
      accent: '#4a7c59',
      sidebarBg: '#1c3a2a',
      sidebarText: '#fef9f0',
      highlight: '#84c49a'
    }
  },

  // ── 13. COPPER ────────────────────────────────────────────────────────────
  // Burnt terracotta banner (#9a3412) + ivory body (#fffbf7).
  // Playfair Display = editorial warmth at scale. Top-banner shows max
  // header impact. Underline rules in warm orange = restrained heat.
  {
    id: 'copper',
    name: 'Copper',
    description: 'Burnt terracotta banner, ivory body. Warm editorial authority.',
    highlights: ['Terracotta banner', 'Warm ivory', 'Marketing & brand'],
    typography: {
      heading: 'text-[38px]',
      body: 'text-[13px]',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Lato', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'top-banner',
    sectionStyle: 'underline',
    colors: {
      primary: '#7c2d12',
      muted: '#92400e',
      background: '#fffbf7',
      accent: '#c2410c',
      headerBg: '#9a3412',
      headerText: '#fff7ed',
      highlight: '#c2410c'
    }
  },

  // ── 14. ONYX ──────────────────────────────────────────────────────────────
  // Charcoal canvas (#1c1917) + rose-gold (#e8c4a0). Cormorant + Jakarta
  // = luxury editorial contrast. Centered-header = full symmetry and gravitas.
  // Gold pill section labels on dark ground = extremely distinctive.
  {
    id: 'onyx',
    name: 'Onyx',
    description: 'Charcoal canvas, rose-gold accents, centered symmetry. Dark luxury.',
    highlights: ['Dark editorial', 'Rose gold', 'Executive luxury'],
    typography: {
      heading: 'text-[42px]',
      body: 'text-[13px]',
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif"
    },
    spacing: 'space-y-6',
    layout: 'centered-header',
    sectionStyle: 'pill',
    colors: {
      primary: '#e8c4a0',
      muted: '#9ca3af',
      background: '#1c1917',
      accent: '#e8c4a0',
      headerBg: '#1c1917',
      headerText: '#faf5f0'
    }
  },

  // ── 15. PRISM ─────────────────────────────────────────────────────────────
  // Vivid cobalt sidebar (#0369a1) + bright white panel. IBM Plex Sans =
  // mono-adjacent engineering precision. bar markers = clean system design.
  // Cloud engineers, SREs, platform teams.
  {
    id: 'prism',
    name: 'Prism',
    description: 'Cobalt sidebar, white panel, IBM Plex Sans precision.',
    highlights: ['Cobalt sidebar', 'SWE & cloud', 'Engineered detail'],
    typography: {
      heading: 'text-[30px]',
      body: 'text-[13px]',
      headingFont: "'IBM Plex Sans', sans-serif",
      bodyFont: "'IBM Plex Sans', sans-serif"
    },
    spacing: 'space-y-4',
    layout: 'sidebar-left',
    sectionStyle: 'bar',
    colors: {
      primary: '#e0f2fe',
      muted: '#93c5fd',
      background: '#f8fafc',
      accent: '#0ea5e9',
      sidebarBg: '#0369a1',
      sidebarText: '#e0f2fe',
      highlight: '#38bdf8'
    }
  },

  // ── 16. DUSK ──────────────────────────────────────────────────────────────
  // Deep navy (#0f172a) + warm peach (#fb923c) on warm off-white (#fffaf7).
  // EB Garamond at 52px = dignified warmth. Hamptone layout showcases the
  // huge-name + circle-photo in navy/peach contrast. GMs, VPs, COOs.
  {
    id: 'dusk',
    name: 'Dusk',
    description: 'Deep navy name, warm peach highlights. Dignified two-column warmth.',
    highlights: ['Navy & peach', 'Executive warmth', 'GM & VP level'],
    typography: {
      heading: 'text-[52px]',
      body: 'text-[13px]',
      headingFont: "'EB Garamond', serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'hamptone',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#0f172a',
      muted: '#64748b',
      background: '#fffaf7',
      accent: '#fb923c',
      highlight: '#f97316'
    }
  },

  // ── 17. CHALK ─────────────────────────────────────────────────────────────
  // Chalk-paper (#f5f0e8) + inky dark type (#1a1108). Playfair heading +
  // EB Garamond body = full ink-on-paper editorial texture. Fia layout
  // gives the big greeting + dot timeline in raw ink style. Journalists,
  // writers, editors, film directors.
  {
    id: 'chalk',
    name: 'Chalk',
    description: 'Chalk-paper canvas, inky dark type. Raw editorial texture.',
    highlights: ['Paper texture', 'Ink editorial', 'Journalist & writer'],
    typography: {
      heading: 'text-[50px]',
      body: 'text-[13.5px]',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'EB Garamond', serif"
    },
    spacing: 'space-y-6',
    layout: 'fia',
    sectionStyle: 'dot',
    colors: {
      primary: '#1a1108',
      muted: '#78716c',
      background: '#f5f0e8',
      accent: '#292524',
      highlight: '#44403c'
    }
  },

  // ── 18. SAGE ──────────────────────────────────────────────────────────────
  // Muted sage sidebar (#3d5a40) + off-white body (#fafaf9). Cormorant =
  // slow considered authority. caps-rule = measured thin-ruled headings.
  // Healthcare professionals, wellness coaches, therapists.
  {
    id: 'sage',
    name: 'Sage',
    description: 'Sage sidebar, neutral body. Calm, grounded, unhurried authority.',
    highlights: ['Sage green', 'Healthcare & wellness', 'Quiet and measured'],
    typography: {
      heading: 'text-[28px]',
      body: 'text-[13px]',
      headingFont: "'Cormorant Garamond', serif",
      bodyFont: "'Lato', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'sidebar-left',
    sectionStyle: 'caps-rule',
    colors: {
      primary: '#fafaf9',
      muted: '#d6d3d1',
      background: '#fafaf9',
      accent: '#6b8f71',
      sidebarBg: '#3d5a40',
      sidebarText: '#f0f4f0',
      highlight: '#a3c4a8'
    }
  },

  // ── 19. BLAZE ─────────────────────────────────────────────────────────────
  // Tangerine full-bleed banner (#ea580c) + white body + Syne geometric type.
  // Top-banner maximises the orange impact above the fold. bracket sectionStyle
  // = [ EXPERIENCE ] zero-convention markers for startup/creative culture fits.
  {
    id: 'blaze',
    name: 'Blaze',
    description: 'Tangerine banner, bracket section labels. Startup energy.',
    highlights: ['Vivid tangerine', 'Bracket labels', 'Creative & startup'],
    typography: {
      heading: 'text-[40px]',
      body: 'text-[13px]',
      headingFont: "'Syne', sans-serif",
      bodyFont: "'DM Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'top-banner',
    sectionStyle: 'bracket',
    colors: {
      primary: '#1c0a00',
      muted: '#78350f',
      background: '#ffffff',
      accent: '#ea580c',
      headerBg: '#ea580c',
      headerText: '#ffffff',
      highlight: '#c2410c'
    }
  },

  // ── 20. MERCURY ───────────────────────────────────────────────────────────
  // Silver-gray paper (#f9f9f9) + near-black ink (#18181b). EB Garamond +
  // Jakarta = quiet luxury. Single-column + underline = max ATS pass rate.
  // "I don't need to try hard." Finance, law, strategy consulting, PE.
  {
    id: 'mercury',
    name: 'Mercury',
    description: 'Silver-gray paper, quiet serif. Understated finance-grade elegance.',
    highlights: ['Quiet luxury', 'ATS-safe', 'Finance & law'],
    typography: {
      heading: 'text-[44px]',
      body: 'text-[13px]',
      headingFont: "'EB Garamond', serif",
      bodyFont: "'Plus Jakarta Sans', sans-serif"
    },
    spacing: 'space-y-5',
    layout: 'single-column',
    sectionStyle: 'underline',
    colors: {
      primary: '#18181b',
      muted: '#71717a',
      background: '#f9f9f9',
      accent: '#52525b',
      highlight: '#3f3f46'
    }
  }
];

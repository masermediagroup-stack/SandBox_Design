# TYLER VEA PORTFOLIO — MEGA PROMPT

> Paste this into Cursor as your system prompt / initial instruction. It contains everything needed to build the full portfolio from scratch.

---

## ROLE

Act as an elite Creative Front-End Developer and UI Engineer specializing in editorial minimalist web design. You are building a personal portfolio website for Tyler Vea — a Design Engineer with 7 years of experience. The site must feel like a curated design exhibition, not a generic portfolio template.

Your code must be production-ready, accessible, performant, and Awwwards-tier in visual quality.

---

## TECH STACK

- **Framework:** Next.js 16+ (App Router, TypeScript)
- **Styling:** CSS Modules + global CSS custom properties (NO Tailwind)
- **Animations:** GSAP (Core + ScrollTrigger), Studio Freight Lenis (smooth scroll)
- **Components:** React for interactive elements, magic.ui components where appropriate
- **Fonts:** Raleway (display/headings, weights 600, 700, 800) + Roboto (body/UI, weights 400, 500, 700) via `next/font/google`
- **Hosting:** Vercel
- **Images:** Next.js `<Image />` component with priority loading for above-fold

---

## DESIGN SYSTEM

### Color Palette

```css
:root {
  /* Core */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-tertiary: #F5F5F5;

  /* Text */
  --text-primary: #0A0A0A;
  --text-secondary: #404040;
  --text-muted: #8A8A8A;

  /* Accent */
  --accent: #7C3AED;          /* Electric Violet */
  --accent-hover: #6D28D9;    /* Darker violet on hover */
  --accent-light: #EDE9FE;    /* Light violet for subtle backgrounds */
  --accent-glow: rgba(124, 58, 237, 0.15); /* For box-shadows / glows */

  /* Borders */
  --border: #E5E5E5;
  --border-hover: #D4D4D4;

  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 0.2s;
  --duration-normal: 0.4s;
  --duration-slow: 0.8s;
}
```

### Typography Scale

```css
/* Display — Raleway */
.display-xl  { font-family: 'Raleway', sans-serif; font-size: clamp(3rem, 8vw, 7rem); font-weight: 800; line-height: 0.95; letter-spacing: -0.03em; }
.display-lg  { font-family: 'Raleway', sans-serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 700; line-height: 1.0; letter-spacing: -0.02em; }
.display-md  { font-family: 'Raleway', sans-serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 600; line-height: 1.1; letter-spacing: -0.01em; }

/* Body — Roboto */
.body-lg     { font-family: 'Roboto', sans-serif; font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.body-md     { font-family: 'Roboto', sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.6; }
.body-sm     { font-family: 'Roboto', sans-serif; font-size: 0.875rem; font-weight: 400; line-height: 1.5; }

/* Labels — Roboto */
.label-lg    { font-family: 'Roboto', sans-serif; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
.label-sm    { font-family: 'Roboto', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
```

### Spacing System

Use an 8px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.

### Interaction States

- **Links:** No underline by default. On hover: underline slides in from left via `::after` pseudo-element using `scaleX(0)` to `scaleX(1)` with `transform-origin: left`. Color shifts to `--accent`.
- **Buttons:** No border-radius or minimal (2px). Solid fill with `--accent` bg + white text. Hover: darken to `--accent-hover`. Transition: 0.3s ease.
- **Cards/Project blocks:** Subtle `translateY(-4px)` lift on hover with `box-shadow: 0 8px 32px var(--accent-glow)`. Image inside scales 1.03x. Transition: 0.5s `--ease-out-expo`.
- **Nav items:** `--text-muted` default. `--text-primary` on hover. `--accent` when active. Transition: 0.2s.

---

## LAYOUT ARCHITECTURE

### Master Layout — Persistent Split Screen

```
|<--------- 100vw ---------->|
|                             |
|  LEFT SIDEBAR  |   RIGHT   |
|  (fixed,       |  CONTENT  |
|   ~320px,      | (scrolls) |
|   centered-y)  |           |
|                |           |
|                             |
```

**Left Sidebar (Fixed):**
- Width: `320px` on desktop, `280px` on large tablets
- Position: `fixed`, `left: 0`, `top: 0`, `height: 100vh`
- Content vertically centered via `display: flex; align-items: center;`
- Padding: `48px`
- Background: `var(--bg-primary)`
- Border-right: `1px solid var(--border)`

**Right Content Area:**
- `margin-left: 320px` on desktop
- Padding: `64px 80px` (generous whitespace)
- Scrollable, Lenis smooth scroll applied here

**Mobile Breakpoint (< 768px):**
- Sidebar collapses to top horizontal bar or hamburger menu
- Content becomes full-width
- Sidebar content reorganizes into a slide-out drawer from the left

**Tablet Breakpoint (768px - 1024px):**
- Sidebar narrows to `240px`
- Content padding reduces to `48px`

---

## LEFT SIDEBAR CONTENT (top to bottom, vertically centered)

### 1. Logo
- TV Monogram at the top of the sidebar content block
- Source: `/images/logo-mark.png` (pink→cyan gradient "TV" lettermark)
- Height: `40px - 48px`, width auto
- Do NOT apply any CSS filters or color overrides — display as-is on white background

### 2. Name + Title
```
TYLER VEA                         ← Raleway, 700, 1.25rem, uppercase, letter-spacing 0.05em
Design Engineer             ← Roboto, 400, 0.875rem, --text-secondary
```

### 3. Short Bio
```
Creating from Central Texas, building brands, websites,
and visual identities for startups and creators.
Currently co-founding Maser Media.
```
— Roboto, 400, 0.875rem, `--text-muted`, `line-height: 1.6`, max 3-4 lines.

### 4. Navigation — Category List

Vertical nav list. Each item is a link. Active item has `--accent` color + a small `4px` accent bar to the left (like a vertical active indicator).

```
Work                              ← Section header (label-sm, --text-muted, margin-bottom: 12px)
─────
Web Design                        ← Nav item (body-md, --text-secondary → hover: --text-primary)
UI/UX                             ← Nav item
Brand Design                      ← Nav item with expand arrow (▸)
  ├── Logos                       ← Sub-item (body-sm, --text-muted, indent 16px, show on expand)
  └── Brand Identities            ← Sub-item
Thumbnail                         ← Nav item
```

**Brand Design dropdown behavior:**
- Click "Brand Design" → sub-items slide down with GSAP `height: auto` animation (0.4s, ease-out-expo)
- Arrow rotates 90° on open
- Sub-items fade in staggered (0.05s each)

### 5. Contact Links (bottom of centered block)

```
──────────────────                ← 1px border, --border, margin: 32px 0 16px
m.tylervea@gmail.com              ← body-sm, --text-muted, hover: --accent
Twitter/X                         ← body-sm, --text-muted, hover: --accent, links to x.com/TylerVDesign
LinkedIn                          ← body-sm, --text-muted, hover: --accent
```

### 6. Availability Badge (optional, below contact)

```
● Available for projects          ← Green dot (#22C55E) + label-sm, --text-muted
```

---

## PAGE STRUCTURE & ROUTING

```
app/
├── layout.tsx                    ← Master layout with sidebar + content area
├── page.tsx                      ← Home / landing page (hero + featured work)
├── work/
│   ├── web-design/
│   │   └── page.tsx              ← Web Design category (3 projects: Caddo, Texas Grounds, Miller More)
│   ├── ui-ux/
│   │   └── page.tsx              ← UI/UX category (components + dashboards)
│   ├── brand-design/
│   │   ├── page.tsx              ← Brand Design overview (redirects to first sub or shows both)
│   │   ├── logos/
│   │   │   └── page.tsx          ← Logo grid (up to 10+ logos)
│   │   └── brand-identities/
│   │       └── page.tsx          ← Brand identity projects (2 initial, with video support)
│   └── thumbnail/
│       └── page.tsx              ← Thumbnail gallery (large masonry grid, 20-50+ images)
├── about/                        ← Optional: dedicated about page if needed
│   └── page.tsx
└── project/
    └── [slug]/
        └── page.tsx              ← Individual project detail page
```

---

## HOME PAGE (page.tsx)

### Hero Section

Layout: Full right-content area. Big typographic statement.

```
TYLER                             ← display-xl, Raleway 800, spans full width
VEA                               ← display-xl, with "VEA" in --accent color
```

Below the name:
```
Design Engineer    ← body-lg, --text-secondary
7 years crafting visual identities,         ← body-md, --text-muted
motion graphics, and market-focused         ← body-md, --text-muted
design across industries.                   ← body-md, --text-muted
```

A single accent line: `2px solid var(--accent)`, width `64px`, margin `32px 0`.

### Featured Work Grid

Below the hero, show 3-4 featured projects in a grid:

```
|  PROJECT CARD  |  PROJECT CARD  |
|                |                |
|  PROJECT CARD  |  PROJECT CARD  |
```

Each card:
- Aspect ratio: `4:3` or `16:10`
- Image fills card with `object-fit: cover`
- On hover: image scales 1.03x, card lifts 4px, accent glow shadow
- Below image: Project title (display-md) + category tag (label-sm, --accent)
- Click → navigates to `/project/[slug]`

---

## CATEGORY PAGES

### Web Design Page (`/work/web-design`)

**Top disclaimer banner:**
```
┌─────────────────────────────────────────────────────────┐
│  Designed and developed by Tyler Vea.                   │  ← body-sm, --text-muted
│  Projects marked with [↗] include live site links.      │  ← body-sm, --text-muted
└─────────────────────────────────────────────────────────┘
```
— Background: `var(--bg-tertiary)`, padding `24px`, border-radius `2px`, margin-bottom `48px`

**Project listing — simple blocks:**

Each project is a horizontal card/row:

```
┌──────────────────────────────────────────────────────────┐
│  [THUMBNAIL]  │  Project Title           Category Tag    │
│   200x150     │  Brief one-line description of the       │
│   rounded 2px │  project and what was delivered.          │
│               │                                          │
│               │  Visit Site ↗            View Case Study →│
└──────────────────────────────────────────────────────────┘
```

- Thumbnail on left, text on right
- "Visit Site ↗" links externally (opens new tab) — ONLY show if project has a live URL
- "View Case Study →" links to `/project/[slug]`
- Hover: entire row gets subtle `var(--bg-secondary)` background + lift

**For projects that aren't scope work but Tyler wants to link:**
- Add a small tag: `External Reference` in `--text-muted` + italic
- These don't get a "View Case Study" link, only "Visit Site ↗"

### UI/UX Page (`/work/ui-ux`)

**Page description (top of page):**
> Interface design rooted in real product thinking. Dashboard components, design systems, and UI explorations — all crafted in Figma and Paper, built to ship.

**Layout:** Card grid (2 columns desktop, 1 mobile). Each card shows the design component or dashboard screenshot with title + brief description below.

**Content notes:**
- All scope work by Tyler
- Projects include design components (buttons, inputs, cards, modals) and dashboard interfaces
- Show the tool used as a tag: `Figma` or `Paper`
- Each card can link to a detail page with more screenshots of the component/dashboard in context

### Brand Design Sub-Pages

**Brand Identities (`/work/brand-design/brand-identities`):**

**Page description (top of page):**
> Complete visual identity systems that define how a brand looks, feels, and speaks. From logo suites to color palettes to motion — every touchpoint considered.

- Card grid: 2 columns desktop, 1 mobile
- Each card shows the brand identity hero image (primary brand deliverable)
- Title + client name below
- Detail page includes: logos, brand imagery, and videos
- **Support video embeds** — brand identity projects may include motion/video assets. Use `<video>` with controls or embed from YouTube/Vimeo.
- Tyler has 2 projects to upload here initially

**Logos (`/work/brand-design/logos`):**

**Page description (top of page):**
> A well-crafted logo leaves a positive and lasting first impression, conveying professionalism and trustworthiness. It's often the first thing people notice about a company — the initial point of contact, whether on a business card, website, or product packaging.

- **Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile**
- Each cell: logo centered on `var(--bg-secondary)` background, generous padding
- Hover: cell background shifts to `var(--bg-tertiary)`, logo scales 1.02x, client name fades in below
- Click: opens a lightbox or detail modal showing the logo at full size + client name + year
- **Must support up to 10+ logos** — grid should look good with any count from 2 to 15
- Logos should be displayed at a consistent cell size regardless of original aspect ratio (contain within cell, don't crop)

### Thumbnail Page (`/work/thumbnail`)

**Page description (top of page):**
> Thumbnails serve as the first visual impression viewers encounter in their YouTube timeline. Thoughtfully designed thumbnails that faithfully reflect your video draw in viewers and enhance comprehension. The choice of colors, text, and facial expressions wield considerable influence over click-through rate and ultimately dictate video success.

- **Masonry grid layout: 3-4 columns on desktop, 2 on tablet, 1 on mobile**
- All thumbnails at `16:9` aspect ratio (standard YouTube)
- Hover: scale 1.05x + `box-shadow: 0 12px 40px rgba(0,0,0,0.15)` + slight lift
- Optional: client name or video title overlay on hover (semi-transparent dark bar at bottom)
- **Must support a LARGE number of thumbnails (20-50+)** — implement lazy loading with `next/image` and `loading="lazy"`
- Consider a "Load More" button or infinite scroll if the count exceeds 24
- No detail page needed — thumbnails are the final deliverable. Clicking opens a lightbox showing the thumbnail at full resolution.
- Group by client if Tyler provides that data, otherwise display as a flat chronological grid

---

## PROJECT DETAIL PAGE (`/project/[slug]`)

Layout:
```
← Back to [Category]              ← label-sm, --text-muted, with left arrow

PROJECT TITLE                     ← display-lg, Raleway 700
Client Name  ·  2024  ·  Web Design    ← body-md, --text-muted

─────────────────────────────────  ← 1px border

Description paragraph. 2-3 sentences    ← body-lg, --text-secondary
about what was delivered and the
impact of the work.

[Visit Live Site ↗]               ← Button, --accent bg, white text (only if URL exists)

─────────────────────────────────

[FULL WIDTH HERO IMAGE]           ← 16:9, rounded 2px

[IMAGE GRID — 2 cols]             ← Additional project images
[IMAGE]  [IMAGE]
[IMAGE]  [IMAGE]

─────────────────────────────────

Next Project →                    ← Navigate to next project in category
```

---

## EFFECTS & ANIMATIONS

### 1. Preloader

- Fullscreen overlay: `position: fixed`, `z-index: 9999`, bg `var(--bg-primary)`
- Center: massive counter in Raleway 800, `clamp(4rem, 15vw, 10rem)`
- Counter animates `0 → 100` over ~2.5 seconds (GSAP tween)
- On complete: overlay slides up (`translateY(-100%)`) with `--ease-out-expo` over 0.8s
- Below counter: "TYLER VEA" in label-sm, `--text-muted`, letter-spacing `0.15em`
- Only show on initial site load (use sessionStorage flag)

### 2. Noise/Grain Overlay

```html
<svg class="noise-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.04;mix-blend-mode:multiply;">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)"/>
</svg>
```

### 3. Lenis Smooth Scroll

```js
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

**Apply Lenis to the RIGHT content area only** — the left sidebar is fixed and shouldn't scroll.

### 4. Scroll-Triggered Animations (GSAP + ScrollTrigger)

**Page transitions:** Content fades in from `opacity: 0, y: 40` on route change. Use Next.js `usePathname()` to detect changes.

**Project cards:** Stagger fade-in as they enter viewport:
```js
gsap.from('.project-card', {
  scrollTrigger: { trigger: '.project-grid', start: 'top 80%' },
  y: 60,
  opacity: 0,
  duration: 0.8,
  stagger: 0.12,
  ease: 'power3.out'
});
```

**Images:** Clip-path reveal on scroll:
```js
gsap.from('.reveal-image', {
  scrollTrigger: { trigger: '.reveal-image', start: 'top 85%' },
  clipPath: 'inset(100% 0% 0% 0%)',
  duration: 1.2,
  ease: 'power4.out'
});
```

**Text lines:** Split text animation for headings:
```js
// Split heading into lines, animate each
gsap.from('.hero-title .line', {
  y: '100%',
  opacity: 0,
  duration: 1,
  stagger: 0.1,
  ease: 'power4.out',
  delay: 0.3 // after preloader
});
```

### 5. magic.ui Components to Integrate

Use these where they naturally fit:
- **`<MagicCard />`** — For project cards (adds gradient border glow on hover)
- **`<TextReveal />`** — For the hero bio text or section headers
- **`<BlurFade />`** — For staggered content appearance
- **`<DotPattern />`** or **`<GridPattern />`** — Subtle background pattern for empty areas
- **`<Marquee />`** — If Tyler wants a scrolling skills/tools ticker
- **`<NumberTicker />`** — For stats (7+ years, X clients, etc.)
- **`<ShimmerButton />`** — For the primary CTA ("View Work" or "Get in Touch")

**Install:** `npx shadcn@latest add "https://magicui.design/r/[component-name]"`

---

## PROJECT DATA STRUCTURE

Create a `/data/projects.ts` file:

```typescript
export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: 'web-design' | 'ui-ux' | 'logos' | 'brand-identities' | 'social-media' | 'poster-exploration' | 'thumbnail';
  description: string;
  thumbnail: string;        // path to thumbnail image
  images: string[];         // paths to project detail images
  liveUrl?: string;         // optional external link
  scope: 'full' | 'design-only' | 'external-reference';
  tags: string[];
  featured: boolean;        // show on home page
}

export const projects: Project[] = [

  // ═══════════════════════════════════════
  // WEB DESIGN (3 projects)
  // ═══════════════════════════════════════

  {
    slug: 'caddo-offices',
    title: 'Caddo Offices',
    client: 'Caddo Offices',
    year: 2025,
    category: 'web-design',
    description: 'Web design and layout build for a local away-from-home office company. Designed to communicate professionalism and accessibility for remote workers seeking flexible workspace solutions.',
    thumbnail: '/images/projects/caddo-offices/thumb.jpg',
    images: [],   // Tyler will add project screenshots
    liveUrl: undefined,  // Add URL when site is live
    scope: 'full',
    tags: ['Web Design', 'Layout', 'Development'],
    featured: true,
  },
  {
    slug: 'texas-grounds',
    title: 'Texas Grounds',
    client: 'Texas Grounds',
    year: 2025,
    category: 'web-design',
    description: 'Web design and full layout development for a landscaping company based in the DFW area of Texas. Built to showcase services, drive local leads, and establish trust with residential and commercial clients.',
    thumbnail: '/images/projects/texas-grounds/thumb.jpg',
    images: [],   // Tyler will add project screenshots
    liveUrl: undefined,
    scope: 'full',
    tags: ['Web Design', 'Layout', 'Development'],
    featured: true,
  },
  {
    slug: 'miller-more-handiwork',
    title: 'Miller More Handy Work',
    client: 'Miller More Handy Work',
    year: 2025,
    category: 'web-design',
    description: 'Full website design and development built inside Framer. A complete end-to-end build delivering a polished digital presence for a hands-on handyman service.',
    thumbnail: '/images/projects/miller-more-handiwork/thumb.jpg',
    images: [],   // Tyler will add project screenshots
    liveUrl: undefined,  // Add Framer URL when live
    scope: 'full',
    tags: ['Web Design', 'Framer', 'Full Build'],
    featured: true,
  },

  // ═══════════════════════════════════════
  // UI/UX (component + dashboard work)
  // ═══════════════════════════════════════
  // Tyler will add individual UI/UX projects here.
  // These are design components and dashboard interfaces
  // created in Figma and Paper.
  // Each entry should include Figma screenshots or exports.

  // ═══════════════════════════════════════
  // BRAND IDENTITIES (2 projects)
  // ═══════════════════════════════════════
  // Tyler will add 2 brand identity projects here.
  // Each includes logos, brand imagery, and videos.
  // Upload assets to /images/projects/[slug]/

  // ═══════════════════════════════════════
  // LOGOS (up to 10)
  // ═══════════════════════════════════════
  // Tyler will add up to 10 logo projects here.
  // These display in a grid — each entry needs at minimum
  // a thumbnail (the logo itself on white/dark bg).

  // ═══════════════════════════════════════
  // THUMBNAILS (large gallery)
  // ═══════════════════════════════════════
  // Tyler will upload a big batch of YouTube thumbnails.
  // These use the gallery/masonry layout — see Thumbnail
  // page spec below for the grid system.
];
```

---

## FILE STRUCTURE

```
tyler-portfolio/
├── app/
│   ├── globals.css               ← CSS custom properties, resets, typography
│   ├── layout.tsx                ← Root layout: sidebar + content + preloader + noise
│   ├── page.tsx                  ← Home: hero + featured grid
│   ├── work/
│   │   ├── web-design/page.tsx
│   │   ├── ui-ux/page.tsx
│   │   ├── brand-design/
│   │   │   ├── page.tsx
│   │   │   ├── logos/page.tsx
│   │   │   └── brand-identities/page.tsx
│   │   └── thumbnail/page.tsx
│   └── project/
│       └── [slug]/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           ← Fixed left navigation
│   │   ├── SidebarNav.tsx        ← Navigation list with dropdown
│   │   ├── ContentArea.tsx       ← Scrollable right content wrapper
│   │   └── MobileNav.tsx         ← Mobile hamburger drawer
│   ├── ui/
│   │   ├── ProjectCard.tsx       ← Reusable project card
│   │   ├── ProjectRow.tsx        ← Horizontal list item (for web design page)
│   │   ├── CategoryTag.tsx       ← Small pill tag
│   │   ├── BackLink.tsx          ← "← Back to [Category]"
│   │   ├── ExternalLink.tsx      ← "Visit Site ↗" button
│   │   └── AvailabilityBadge.tsx ← Green dot + text
│   ├── effects/
│   │   ├── Preloader.tsx         ← Counter + slide-up overlay
│   │   ├── NoiseOverlay.tsx      ← SVG grain texture
│   │   ├── SmoothScroll.tsx      ← Lenis wrapper (client component)
│   │   ├── ScrollReveal.tsx      ← GSAP scroll-triggered reveal wrapper
│   │   └── TextSplit.tsx         ← Split text animation component
│   └── sections/
│       ├── HeroSection.tsx       ← Home hero
│       ├── FeaturedGrid.tsx      ← Home featured projects
│       └── ProjectDetail.tsx     ← Full project view
├── data/
│   └── projects.ts               ← Project data array
├── hooks/
│   ├── useGSAP.ts                ← GSAP context + cleanup hook
│   └── useLenis.ts               ← Lenis instance hook
├── lib/
│   └── utils.ts                  ← Shared utilities
├── public/
│   ├── images/
│   │   ├── logo-mark.png         ← TV Monogram (pink→cyan gradient)
│   │   ├── logo-star.png         ← Star Symbol (pink→cyan gradient, use for favicon)
│   │   └── projects/             ← Project images organized by slug
│   │       ├── caddo-offices/    ← Web design screenshots
│   │       ├── texas-grounds/    ← Web design screenshots
│   │       ├── miller-more-handiwork/ ← Framer build screenshots
│   │       ├── ui-ux/            ← Component + dashboard screenshots
│   │       ├── brand-identities/ ← Brand identity assets + videos
│   │       ├── logos/            ← Individual logo files (up to 10+)
│   │       └── thumbnails/       ← YouTube thumbnails (bulk, 20-50+)
│   └── fonts/
│       └── README.md             ← Do not add fonts unless replacing the approved stack
├── styles/
│   ├── sidebar.module.css
│   ├── hero.module.css
│   ├── projects.module.css
│   └── project-detail.module.css
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## PACKAGES TO INSTALL

```bash
# Core
npx create-next-app@latest tyler-portfolio --typescript --app --src-dir=false --import-alias="@/*"

# Animation
npm install gsap @studio-freight/lenis

# magic.ui (install individual components as needed)
npx shadcn@latest init
npx shadcn@latest add "https://magicui.design/r/magic-card"
npx shadcn@latest add "https://magicui.design/r/text-reveal"
npx shadcn@latest add "https://magicui.design/r/blur-fade"
npx shadcn@latest add "https://magicui.design/r/number-ticker"
npx shadcn@latest add "https://magicui.design/r/shimmer-button"
npx shadcn@latest add "https://magicui.design/r/dot-pattern"
npx shadcn@latest add "https://magicui.design/r/marquee"
```

---

## CRITICAL RULES

1. **NO TAILWIND.** All styling via CSS Modules + CSS custom properties.
2. **NO WORDPRESS.** This is Next.js on Vercel. Period.
3. **Light mode only.** White bg, black text, Electric Violet accents.
4. **Every image uses `next/image`** with proper `width`, `height`, `alt`, and `priority` for above-fold.
5. **Sidebar is always fixed on desktop.** Content scrolls independently on the right.
6. **Mobile-first responsive.** Sidebar becomes a drawer/hamburger on mobile.
7. **No placeholder images in production.** Use solid `var(--bg-tertiary)` blocks with project initials until Tyler provides real assets.
8. **GSAP cleanup:** Always use `gsap.context()` in `useEffect` and return `ctx.revert()` on unmount.
9. **Lenis cleanup:** Kill the Lenis instance on unmount.
10. **Preloader fires only on first visit** — use `sessionStorage` to track.
11. **All text content comes from data files** — no hardcoded strings in components (except layout chrome).
12. **Semantic HTML:** Use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` correctly.
13. **Performance:** Lazy load below-fold images. Use `loading="lazy"` and `sizes` attributes.
14. **Accessibility:** Proper focus states (visible focus rings using `--accent`), aria-labels on icons, skip-to-content link.

---

## INSPIRATION REFERENCE

Primary: [verse.sh](https://www.verse.sh/?ref=godly) — study the minimal layout, generous whitespace, editorial typography, and how work is presented in clean blocks.

Tyler's twist: Left-persistent sidebar navigation (verse.sh is more traditional top-nav). More editorial, more structured. The sidebar gives the site a "curated studio" feel vs a scrolling page.

---

## IMPLEMENTATION ORDER

Build in this sequence:

1. **Project scaffolding** — Next.js init, install deps, set up globals.css with design tokens
2. **Layout shell** — Sidebar + content area + responsive breakpoints
3. **Sidebar component** — Logo, name, bio, nav with Brand Design dropdown, contact links
4. **Home page** — Hero typography + featured work grid (use placeholder data)
5. **Project data structure** — Create `projects.ts` with 2-3 sample entries
6. **Category pages** — Web Design (with disclaimer), UI/UX, Brand Design sub-pages, Posters, Thumbnails
7. **Project detail page** — Dynamic `[slug]` route with back nav, images, description
8. **Effects layer** — Preloader, noise overlay, Lenis smooth scroll
9. **GSAP animations** — Scroll reveals, card hovers, text splits, page transitions
10. **magic.ui integration** — Swap in MagicCard, TextReveal, etc. where they elevate
11. **Mobile responsive** — Hamburger drawer, reflow grids, touch-friendly targets
12. **Polish** — Loading states, error boundaries, metadata/SEO, favicon, OG images

---

## TYLER'S BIO CONTENT (use in sidebar + about)

**Short (sidebar):**
Creating from Central Texas, building brands, websites, and visual identities for startups and creators. Currently co-founding Maser Media.

**Medium (home hero):**
Design Engineer with seven years of experience crafting compelling visual identities, motion graphics, and market-focused design across industries.

**Full (about page or project detail context):**
Design Engineer with seven years of experience crafting compelling visual identities, motion graphics, and market-focused design across industries. Proficient across the full Adobe Suite — including Photoshop, Illustrator, and After Effects — with hands-on experience in social media branding, editorial design, production work, poster design, and streaming graphics. Known for developing big-picture creative concepts and executing them with precision, ensuring every deliverable speaks directly to the intended audience and market.

A natural collaborator and idea generator who thrives in fast-paced creative environments. Experienced in managing multiple client relationships simultaneously, delivering cohesive brand identities for startups, product companies, content creators, and media organizations. Currently expanding into UI/UX design and AI-assisted creative workflows, bridging traditional design craft with modern tools to future-proof every project.

---

## CONTACT INFO

- **Email:** m.tylervea@gmail.com
- **Twitter/X:** [@TylerVDesign](https://x.com/TylerVDesign)
- **LinkedIn:** [Tyler Vea](https://linkedin.com/in/tylervea) ← update with actual URL

---

## LOGO FILES

**Source files on Tyler's machine:**
- **TV Monogram (Stamp):** `D:\GFX Folder\TylerV branding\Branding 25'\1x\TylerV Mark.png`
- **Star Symbol:** `D:\GFX Folder\TylerV branding\Branding 25'\1x\TylerV Star.png`

**Copy to project:**
```bash
cp "D:\GFX Folder\TylerV branding\Branding 25'\1x\TylerV Mark.png" public/images/logo-mark.png
cp "D:\GFX Folder\TylerV branding\Branding 25'\1x\TylerV Star.png" public/images/logo-star.png
```

**Logo Details:**
- Both use a **pink → white → cyan gradient** (NOT the site's Electric Violet accent)
- The logos have their own color identity — do NOT recolor them to match the violet accent
- **TV Monogram:** Stylized "TV" lettermark with smooth curve connecting T into V. Small star symbol in bottom-right corner. Use in sidebar at ~40-48px height.
- **Star Symbol:** Abstract organic flower/star shape with overlapping petals creating depth. Use as favicon, loading screen accent, or decorative element.

**Usage rules:**
- Sidebar: TV Monogram (`logo-mark.png`) at top of nav content
- Favicon: Star Symbol (`logo-star.png`), generate favicon set from this
- Preloader: Star Symbol can appear below the counter text
- The gradient logos look best on white backgrounds — they'll be barely visible on dark surfaces

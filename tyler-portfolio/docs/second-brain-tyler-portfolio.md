# Second Brain — Tyler Vea Portfolio

## Project Overview

Personal portfolio website for Tyler Vea. Editorial minimalist design inspired by verse.sh with a persistent left sidebar layout.

## Key Decisions

- **Fonts:** **Raleway** (display / `.display-*`, `--font-display`) + **Roboto** (body / UI, `--font-body`) via `next/font/google`
- **Colors:** White bg, black text, Electric Violet (#7C3AED) accents
- **Layout:** Fixed left sidebar (320px) + scrollable right content
- **Effects:** Preloader, noise grain overlay, Lenis smooth scroll, and SmoothCursor custom cursor on desktop pointer devices
- **Theme:** Light only, no dark mode toggle
- **Framework:** Next.js 16+ (App Router, TypeScript), **CSS Modules + design tokens for layout**, Tailwind for shadcn / Magic UI islands
- **Animations:** GSAP + ScrollTrigger, magic.ui components
- **Hosting:** Vercel + custom domain
- **Disclaimer:** "Designed and developed by Tyler Vea" — full scope credit

## Architecture

- Split-screen layout: fixed sidebar + scrollable content
- Category routing under `/work/[category]`
- Dynamic project detail at `/project/[slug]`
- Brand Design has dropdown sub-navigation (Logos, Brand Identities, Social Media)
- Project data centralized in `/data/projects.ts`

## What I Learned

- Lenis `wrapper` / `content` must be the overflow scroll element and its inner content node; `gsap.ticker` drives `lenis.raf(performance.now())` with ScrollTrigger sync.
- `BrandDesignNav` resets open state on route changes via `key={pathname}` so sub-nav stays in sync without effects.
- Magic UI `MagicCard` depends on `next-themes`; the app forces light mode only via `ThemeProvider`.

## Gotchas

- GSAP needs `gsap.context()` in React for cleanup
- Lenis should only apply to the content area, not the fixed sidebar
- Preloader should only fire on first visit (sessionStorage)
- Keep the font stack limited to Raleway display weights 600/700/800 and Roboto body/UI weights 400/500/700.

## Date Started

April 13, 2026

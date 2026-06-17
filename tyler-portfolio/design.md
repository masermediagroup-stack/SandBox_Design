# Tyler Vea Portfolio Design System

This document is the source of truth for the portfolio visual system. The current direction is a 50/50 blend: Tyler's fixed portfolio shell, shader-led creative identity, and violet brand accent combined with Apple-inspired restraint, full-bleed gallery rhythm, photography-first hierarchy, and low-chrome surfaces.

## Brand Position

The site should feel like a refined creative portfolio for brand systems, marketing, motion, and websites. It is not an Apple clone and should not adopt Apple's blue or top navigation. The Apple influence shows up as discipline: less visible UI chrome, larger image-led sections, alternating light and dark gallery surfaces, and one precise action color.

The memorable signature is the contrast between a quiet white identity rail and cinematic work tiles. Tyler's violet remains the only action accent.

## Color

Core CSS tokens live in `app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--bg-primary` | `#f6f6fa` | Main page canvas |
| `--bg-secondary` | `#eef2f6` | Menus, cards, utility surfaces, and quiet controls |
| `--bg-tertiary` | `#eef2f6` | Media placeholders and support surfaces |
| `--bg-parchment` | `#f6f6fa` | Landing page section canvas |
| `--surface-dark` | `#272729` | Primary dark gallery tile |
| `--surface-dark-2` | `#2a2a2c` | Secondary dark tile step |
| `--surface-black` | `#050507` | Shader hero and true dark media surfaces |
| `--text-primary` | `#838693` | Default text, labels, and body emphasis |
| `--text-secondary` | `#838693` | Body copy and default navigation |
| `--text-muted` | `#838693` | Captions, metadata, inactive utility text |
| `--text-on-dark` | `#f6f6fa` | Text on shader and dark tiles |
| `--text-muted-on-dark` | `#eef2f6` | Secondary text on dark tiles |
| `--portfolio-accent` | `#7c3aed` | CTAs, active states, focus rings, globe markers |
| `--portfolio-accent-hover` | `#6d28d9` | Primary CTA hover |
| `--portfolio-accent-light` | `#ede9fe` | Soft violet support tint |
| `--portfolio-accent-glow` | `rgba(124, 58, 237, 0.14)` | Rare low-opacity accent glow |
| `--border-line` | `#ebecf0` | Default hairlines and utility borders |
| `--border-soft` | `rgba(131, 134, 147, 0.2)` | Soft rings and frosted chrome edges |
| `--border-hover` | `#ebecf0` | Hover hairlines |
| `--product-shadow` | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | Image-only depth |

Apple Action Blue is source inspiration only. Do not ship it as a Tyler interaction token.

## Typography

Fonts are loaded in `app/layout.tsx` through `next/font/google`.

| Role | Font | Weights | Notes |
| --- | --- | --- | --- |
| Display | Raleway | 600, 700, 800 | Tyler brand voice. Use 800 only for the main hero or one-off display moments. |
| Body | Roboto | 400, 500, 700 | UI and reading text. Default body copy should feel closer to Apple's 17px rhythm. |

Type utilities live in `app/globals.css`.

| Class | Size | Weight | Use |
| --- | --- | --- | --- |
| `.display-xl` | `clamp(3rem, 7.4vw, 7rem)` | 800 | Main hero display only |
| `.display-lg` | `clamp(2rem, 4.8vw, 4.5rem)` | 700 | Major page headings |
| `.display-md` | `clamp(1.5rem, 2.8vw, 2.5rem)` | 600 | Tile and card titles |
| `.body-lg` | `1.125rem` | 400 | Lead copy |
| `.body-md` | `1.0625rem` | 400 | Default paragraph rhythm |
| `.body-sm` | `0.875rem` | 400 | Sidebar copy and metadata |
| `.label-sm` | `0.75rem` | 500 | Quiet labels and section metadata |

Guidelines:

- Use tight display tracking for Raleway, but do not overuse hero-scale type inside small cards.
- Keep labels quieter than headings. Violet should not appear on every label.
- Body copy should stay around 65 characters per line where possible.
- Use `text-wrap: balance` for display headings and `text-wrap: pretty` for paragraphs.

## Layout

The site uses a fixed left sidebar and an internal scroll region. This shell is part of Tyler's identity and should remain.

- Desktop sidebar: `320px` wide with `56px` horizontal padding.
- Desktop main offset: `margin-left: 320px`.
- Tablet sidebar: `216px` wide with `24px` horizontal padding.
- Mobile: sidebar is hidden and the frosted mobile bar controls the drawer.
- Main scroll padding: `64px 80px` on desktop, `48px` on tablet, `96px 24px 48px` on mobile.
- Inner content max width: `1200px`.

Homepage rhythm:

1. Dark shader hero tile.
2. Off-white selected-work intro.
3. Off-white project carousel bands with rounded project cards.
4. Parchment footer with globe as the closing artifact.

Avoid marketing-page hero/card layouts. The first screen is the portfolio experience.

## Components

### Sidebar

The sidebar is a frosted white identity rail with a soft hairline edge. It should feel quieter than the work. Active links use violet text plus a slim indicator. The Brand Design group keeps its existing disclosure behavior.

### Mobile Nav

The mobile bar is a frosted parchment strip with a pill-shaped menu button. The drawer uses the same white rail grammar as the desktop sidebar and should not become a black Apple global nav.

### Hero

The hero remains the dark Shader Park opening tile. It should read as Tyler's expressive counterpoint to Apple's restraint: cinematic, image-like, and full-bleed inside the portfolio shell.

Hero CTAs follow the merged grammar:

- Primary: violet pill, white text, no heavy shadow.
- Secondary: translucent neutral pill on dark surfaces.
- Pressed state: `transform: scale(0.98)`.

### Selected Work

Selected work is the strongest Apple-inspired area. Each featured item sits in a viewport-scale carousel band on one continuous off-white canvas. The project image carries the visual weight; cards and controls do not need heavy shadows.

Project-card rules:

- Keep the project image large and crisp.
- Use one shared exposed radius for thumbnails, media, and card corners.
- Raise the project title/category footer into the bottom of the thumbnail so the project card reads as one object.
- Reserve depth for the image/media plane with `--product-shadow`.
- Keep title and category compact, inside the raised footer overlay.

Project carousel rules:

- Use GSAP only for the assisted scroll lock between project cards.
- The scroll assist should feel like a gentle push to the next project, not a hard trap.
- The rotating dial is a position cue, not primary navigation.
- Respect `prefers-reduced-motion` by falling back to normal scroll behavior.

### Forms And Utility Surfaces

Forms use white or pearl surfaces, 1px hairlines, pill CTAs, and violet focus rings. Avoid decorative keyline/button tricks. Filled form labels can use muted text rather than green success color unless actual validation is present.

### Footer

The footer should feel like a parchment close to the gallery. The globe remains black/white/violet and the headline stays restrained and centered.

## Motion

Motion should remain subtle and composited.

- Default easing: `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Duration scale: `--duration-fast: 0.2s`, `--duration-normal: 0.4s`, `--duration-slow: 0.8s`.
- Animate only `transform`, `opacity`, and `filter` for common UI.
- Buttons may use a small lift on hover and `scale(0.98)` on active.
- Respect `prefers-reduced-motion`.

## Borders, Radius, And Depth

- Full gallery bands are rectangular and edge-to-edge within the content frame, but all exposed card/media corners use the same radius.
- Utility cards use `18px` radius only when they need a contained card shape.
- CTAs and search/input affordances use pill radius.
- Default media radius stays tight at `8px` or less.
- Do not add shadows to text, cards, buttons, or nav chrome.
- Use `--product-shadow` only for project imagery or visual artifacts that need to rest on a surface.

## Imagery And Effects

- Use real portfolio assets for work cards, logos, and brand artifacts.
- Shader Park belongs in the hero; ShaderGradient belongs in the sidebar only if it stays quiet.
- Avoid decorative orbs, generic blobs, and CSS gradient backgrounds that compete with work.
- If a section feels empty, solve it with stronger work imagery or better spacing before adding decoration.

## Do And Do Not

Do:

- Keep violet as the only action accent.
- Use alternating gallery surfaces to create section rhythm.
- Make the project asset the loudest element in each work band.
- Use neutral hairlines, parchment surfaces, and frosted chrome for restraint.

Do not:

- Replace the fixed sidebar with Apple's top nav.
- Introduce Apple blue as an interaction color.
- Add heavy card/button shadows as hierarchy.
- Mix multiple exposed thumbnail radii on the landing page.
- Add a second decorative accent color.

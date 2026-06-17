# Media Intake

Use lowercase kebab-case names so paths stay readable in `data/projects.ts` and work cleanly with `next/image`.

## Folder Convention

```text
public/images/projects/
  web-design/
    caddo-offices/
      thumbnail.png
      hero.png
      01-home.png
      02-services.png
      03-mobile.png
  ui-ux/
    project-slug/
      thumbnail.png
      hero.png
      01-flow.png
      02-components.png
  brand-identities/
    project-slug/
      thumbnail.png
      hero.png
      01-logo-suite.png
      02-palette.png
      03-social.png
  social-media/
    project-slug/
      thumbnail.png
      hero.png
      01-post.png
      02-story.png
  poster-exploration/
    project-slug/
      thumbnail.png
      hero.png
  thumbnails/
    project-or-client-name/
      01-video-title.png
      02-video-title.png
```

Use `thumbnail.png` for cards and index rows. Use `hero.png` as the first detail-page image. Number supporting images in the order they should appear.

## Current Project Asset Checklist

These project slugs exist in `data/projects.ts` and still need project media:

- `caddo-offices`
- `texas-grounds`
- `miller-more-handiwork`
- `dashboard-kit-alpha`
- `component-library-beta`
- `brand-alpha`
- `brand-beta`
- `social-launch-kit`

The logo gallery already has real files under `public/images/logos/`.

The thumbnail gallery is intentionally empty until real thumbnail images are added under `public/images/thumbnails/`.

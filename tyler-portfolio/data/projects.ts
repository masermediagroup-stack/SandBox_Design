export type ProjectCategory =
  | "web-design"
  | "ui-ux"
  | "motion-design"
  | "logos"
  | "brand-identities"
  | "social-media"
  | "poster-exploration"
  | "thumbnail";

export type ProjectScope = "full" | "design-only" | "external-reference";

/** Groups rows on `/work/web-design` under “Scope Work” vs “Client Work”. */
export type WebDesignGroup = "scope" | "client";

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: ProjectCategory;
  description: string;
  thumbnail: string | null;
  images: string[];
  liveUrl?: string;
  /** External preview URL if `liveUrl` is not set — detail page “Visit Live Site” fallback only. */
  caseStudyUrl?: string;
  /** When true, web-design rows show only Visit Site (no “View Case Study” link). */
  hideCaseStudyRow?: boolean;
  /** Only for `category: "web-design"`. Defaults to `"scope"` when omitted. */
  webDesignGroup?: WebDesignGroup;
  scope: ProjectScope;
  tags: string[];
  featured: boolean;
  featuredOrder?: number;
  tool?: string;
  videoUrl?: string;
}

export const projects: Project[] = [
  {
    slug: "miller-more-handiwork",
    title: "MillerMore Handi Work",
    client: "MillerMore Handi Work",
    year: 2025,
    category: "web-design",
    description:
      "Full website design and development built inside Framer. A complete end-to-end build delivering a polished digital presence for a hands-on handyman service.",
    thumbnail: "/images/projects/miller-more-handiwork/thumb.png",
    images: [],
    liveUrl: "https://millermorehandiwork.com",
    webDesignGroup: "client",
    scope: "full",
    tags: ["Web Design", "Framer", "Full Build"],
    featured: true,
    featuredOrder: 1,
  },
  {
    slug: "caddo-offices",
    title: "Caddo Offices",
    client: "Caddo Offices",
    year: 2025,
    category: "web-design",
    description:
      "Web design and layout build for a local away-from-home office company. Designed to communicate professionalism and accessibility for remote workers seeking flexible workspace solutions.",
    thumbnail: null,
    images: [],
    liveUrl: "https://caddo-redesign.vercel.app",
    scope: "full",
    tags: ["Web Design", "Layout", "Development"],
    featured: false,
  },
  {
    slug: "texas-grounds",
    title: "Texas Grounds",
    client: "Texas Grounds",
    year: 2025,
    category: "web-design",
    description:
      "Web design and full layout development for a landscaping company based in the DFW area of Texas. Built to showcase services, drive local leads, and establish trust with residential and commercial clients.",
    thumbnail: null,
    images: [],
    liveUrl:
      "https://texasgrounds-1vu6pgcvg-masermediagroup-stacks-projects.vercel.app/#portfolio",
    scope: "full",
    tags: ["Web Design", "Layout", "Development"],
    featured: false,
  },
  {
    slug: "dashboard-kit-alpha",
    title: "Dashboard Kit",
    client: "Internal",
    year: 2025,
    category: "ui-ux",
    description:
      "Modular dashboard surfaces, tables, and filters designed for dense data without visual noise.",
    thumbnail: null,
    images: [],
    scope: "design-only",
    tags: ["Dashboard", "Design System"],
    featured: true,
    featuredOrder: 4,
    tool: "Figma",
  },
  {
    slug: "component-library-beta",
    title: "Component Library",
    client: "Internal",
    year: 2025,
    category: "ui-ux",
    description:
      "Inputs, dialogs, and cards with consistent spacing scales and interaction states.",
    thumbnail: null,
    images: [],
    scope: "design-only",
    tags: ["UI", "Components"],
    featured: false,
    tool: "Paper",
  },
  {
    slug: "brand-alpha",
    title: "Brand Alpha",
    client: "Client A",
    year: 2024,
    category: "brand-identities",
    description:
      "Identity system with motion-forward hero, color logic, and typographic hierarchy for launch.",
    thumbnail: null,
    images: [],
    scope: "full",
    tags: ["Identity", "Motion"],
    featured: true,
    featuredOrder: 2,
  },
  {
    slug: "maser-media-logo-system",
    title: "Maser Media Logo System",
    client: "Maser Media",
    year: 2025,
    category: "logos",
    description:
      "Logo system preview for a clean brand mark, scaled for the portfolio wheel and logo gallery direction.",
    thumbnail: "/images/logos/maser-media.png",
    images: [],
    scope: "design-only",
    tags: ["Logo", "Brand Mark"],
    featured: true,
    featuredOrder: 3,
  },
  {
    slug: "brand-beta",
    title: "Brand Beta",
    client: "Client B",
    year: 2024,
    category: "brand-identities",
    description:
      "Full visual language including logo suite, patterns, and social templates.",
    thumbnail: null,
    images: [],
    videoUrl: undefined,
    scope: "full",
    tags: ["Identity", "Guidelines"],
    featured: false,
  },
  {
    slug: "social-launch-kit",
    title: "Launch Kit",
    client: "Creator Collective",
    year: 2025,
    category: "social-media",
    description:
      "Campaign-ready social frames, story sets, and cover art aligned to a single grid.",
    thumbnail: null,
    images: [],
    scope: "full",
    tags: ["Social", "Campaign"],
    featured: false,
  },
  {
    slug: "motion-reel-study",
    title: "Motion Reel Study",
    client: "Internal",
    year: 2025,
    category: "motion-design",
    description:
      "Temporary motion design study for animated brand cards, kinetic type, and social-first movement systems.",
    thumbnail: null,
    images: [],
    scope: "design-only",
    tags: ["Motion", "Animation", "Study"],
    featured: false,
    tool: "After Effects",
  },
];

export interface LogoItem {
  id: string;
  client: string;
  year: string;
  src: string | null;
}

export const logos: LogoItem[] = [
  { id: "logo-1", client: "GAB", year: "2024", src: "/images/logos/gab-logo.png" },
  { id: "logo-2", client: "Gavman", year: "2022", src: "/images/logos/gavman-logo.png" },
  { id: "logo-3", client: "Jace", year: "2022", src: "/images/logos/jace-logo.png" },
  {
    id: "logo-4",
    client: "Maser Media",
    year: "2025",
    src: "/images/logos/maser-media.png",
  },
  {
    id: "logo-5",
    client: "Milly's Bowtique",
    year: "2023",
    src: "/images/logos/millys-bowtique.png",
  },
  {
    id: "logo-6",
    client: "Adornare Beauty Academy",
    year: "2019",
    src: "/images/logos/adornare-beauty-academy.png",
  },
  { id: "logo-7", client: "Dakota", year: "2023", src: "/images/logos/dakota-logo.png" },
  {
    id: "logo-8",
    client: "Kevin Morgan Music",
    year: "2025",
    src: "/images/logos/kevin-morgan-music.png",
  },
];

export interface ThumbnailItem {
  id: string;
  title: string;
  client?: string;
  src: string | null;
}

export const thumbnails: ThumbnailItem[] = [];

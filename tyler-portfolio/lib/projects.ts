import type { Project, ProjectCategory, WebDesignGroup } from "@/data/projects";
import { projects } from "@/data/projects";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .toSorted((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

/** Preserves order from `projects` within each group. */
export function partitionWebDesignProjects(
  list: Project[],
): Record<WebDesignGroup, Project[]> {
  const scope: Project[] = [];
  const client: Project[] = [];
  for (const p of list) {
    if (p.category !== "web-design") continue;
    const g: WebDesignGroup = p.webDesignGroup ?? "scope";
    if (g === "client") client.push(p);
    else scope.push(p);
  }
  return { scope, client };
}

export function getNextProjectInCategory(
  slug: string,
  category: ProjectCategory,
): Project | undefined {
  const list = getProjectsByCategory(category);
  const idx = list.findIndex((p) => p.slug === slug);
  if (idx === -1 || idx === list.length - 1) return undefined;
  return list[idx + 1];
}

export function categoryLabel(category: ProjectCategory): string {
  const map: Record<ProjectCategory, string> = {
    "web-design": "Web Design",
    "ui-ux": "UI/UX",
    "motion-design": "Motion Design",
    logos: "Logos",
    "brand-identities": "Brand Identities",
    "social-media": "Social Media",
    "poster-exploration": "Poster Exploration",
    thumbnail: "Thumbnail",
  };
  return map[category];
}

export function categoryPath(category: ProjectCategory): string {
  const map: Record<ProjectCategory, string> = {
    "web-design": "/work/web-design",
    "ui-ux": "/work/ui-ux",
    "motion-design": "/work/motion-design",
    logos: "/work/brand-design/logos",
    "brand-identities": "/work/brand-design/brand-identities",
    "social-media": "/work/brand-design/social-media",
    "poster-exploration": "/work/poster-exploration",
    thumbnail: "/work/thumbnail",
  };
  return map[category];
}

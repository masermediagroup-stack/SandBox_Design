import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const dataPath = path.join(root, "data", "projects.ts");
const source = readFileSync(dataPath, "utf8");

const PROJECTS_RE = /export const projects: Project\[] = \[([\s\S]*?)\];/m;
const projectBlock = source.match(PROJECTS_RE)?.[1] ?? "";
const projectEntries = [...projectBlock.matchAll(/\{\s*slug: "([^"]+)"([\s\S]*?)\n\s*\},/g)].map(
  ([, slug, body]) => ({
    slug,
    title: body.match(/title: "([^"]+)"/)?.[1] ?? slug,
    category: body.match(/category: "([^"]+)"/)?.[1] ?? "unknown",
    thumbnail: body.match(/thumbnail: "([^"]+)"/)?.[1] ?? null,
    images:
      body
        .match(/images: \[([\s\S]*?)\]/)?.[1]
        ?.match(/"([^"]+)"/g)
        ?.map((value) => value.slice(1, -1)) ?? [],
  }),
);

const thumbnailEntries =
  source
    .match(/export const thumbnails: ThumbnailItem\[] = \[([\s\S]*?)\];/m)?.[1]
    ?.match(/src: "([^"]+)"/g)
    ?.map((value) => value.match(/"([^"]+)"/)?.[1])
    .filter(Boolean) ?? [];

function publicPathExists(src) {
  if (!src?.startsWith("/")) return false;
  return existsSync(path.join(publicDir, src.slice(1)));
}

const referenced = [
  ...projectEntries.flatMap((project) => [
    project.thumbnail,
    ...project.images,
  ]),
  ...thumbnailEntries,
].filter(Boolean);

const missingReferences = referenced.filter((src) => !publicPathExists(src));
const projectsWithoutMedia = projectEntries.filter(
  (project) => !project.thumbnail && project.images.length === 0,
);

console.log("Media audit");
console.log(`- Projects: ${projectEntries.length}`);
console.log(`- Referenced media paths: ${referenced.length}`);
console.log(`- Broken referenced paths: ${missingReferences.length}`);
console.log(`- Projects without thumbnail/images: ${projectsWithoutMedia.length}`);

if (projectsWithoutMedia.length > 0) {
  console.log("\nProjects still needing media:");
  for (const project of projectsWithoutMedia) {
    console.log(`- ${project.slug} (${project.category})`);
  }
}

if (missingReferences.length > 0) {
  console.log("\nBroken media references:");
  for (const src of missingReferences) {
    console.log(`- ${src}`);
  }
  process.exitCode = 1;
}

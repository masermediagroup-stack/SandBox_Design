import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import {
  categoryLabel,
  categoryPath,
  getNextProjectInCategory,
  getProjectBySlug,
} from "@/lib/projects";

import { BackLink } from "@/components/ui/BackLink";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { PlaceholderBlock } from "@/components/ui/PlaceholderBlock";
import { ProjectVideo } from "@/components/ui/ProjectVideo";

import styles from "@/styles/project-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getNextProjectInCategory(slug, project.category);
  const backHref = categoryPath(project.category);
  const backLabel = categoryLabel(project.category);

  return (
    <article>
      <BackLink href={backHref} label={backLabel} />

      <header>
        <h1 className="display-lg text-[var(--text-primary)]">{project.title}</h1>
        <p className="body-md mt-4 text-[var(--text-muted)]">
          {project.client} · {project.year} · {categoryLabel(project.category)}
        </p>
      </header>

      <hr className={styles.rule} />

      <p className="body-lg text-[var(--text-secondary)]">{project.description}</p>

      {(() => {
        const { liveUrl, caseStudyUrl } = project;
        if (!liveUrl && !caseStudyUrl) return null;

        const btnClass =
          "inline-flex rounded-[2px] bg-[var(--portfolio-accent)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--portfolio-accent-hover)]";

        if (liveUrl && caseStudyUrl && liveUrl !== caseStudyUrl) {
          return (
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href={liveUrl} target="_blank" rel="noreferrer" className={btnClass}>
                Visit Live Site ↗
              </a>
              <a
                href={caseStudyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[var(--portfolio-accent)] underline-offset-4 transition-colors hover:text-[var(--portfolio-accent-hover)] hover:underline"
              >
                View case study →
              </a>
            </div>
          );
        }

        const href = liveUrl ?? caseStudyUrl!;
        return (
          <p className="mt-8">
            <a href={href} target="_blank" rel="noreferrer" className={btnClass}>
              Visit Live Site ↗
            </a>
          </p>
        );
      })()}

      {project.videoUrl ? (
        <div className="mt-10">
          <ProjectVideo url={project.videoUrl} />
        </div>
      ) : null}

      <div className={styles.hero}>
        {project.images[0] || project.thumbnail ? (
          <ImageReveal
            src={project.images[0] ?? project.thumbnail!}
            alt={`${project.title} project preview`}
            width={1200}
            height={675}
            className="w-full"
          />
        ) : (
          <PlaceholderBlock label={project.title} ratio="16/9" />
        )}
      </div>

      {project.images.length > 1 ? (
        <div className={styles.grid}>
          {project.images.slice(1).map((src) => (
            <ImageReveal
              key={src}
              src={src}
              alt={`${project.title} supporting project image`}
              width={800}
              height={600}
            />
          ))}
        </div>
      ) : null}

      <hr className={styles.rule} />

      {next ? (
        <Link href={`/project/${next.slug}`} className={styles.next}>
          Next Project → <span className="text-[var(--text-primary)]">{next.title}</span>
        </Link>
      ) : null}
    </article>
  );
}

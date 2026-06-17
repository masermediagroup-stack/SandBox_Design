"use client";

import type { Project } from "@/data/projects";
import { categoryLabel } from "@/lib/projects";
import Image from "next/image";
import Link from "next/link";

import { MagicCard } from "@/components/ui/magic-card";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { PlaceholderBlock } from "@/components/ui/PlaceholderBlock";

import styles from "@/styles/project-card.module.css";

export function ProjectCard({ project }: { project: Project }) {
  const imageClassName =
    project.slug === "miller-more-handiwork"
      ? `h-full w-full object-contain ${styles.millerMoreImage}`
      : "h-full w-full object-contain";

  return (
    <Link href={`/project/${project.slug}`} className={styles.card}>
      <MagicCard
        className="rounded-[var(--project-radius,24px)] border border-[var(--border-soft)] bg-[var(--bg-primary)] p-0"
        gradientFrom="rgba(124, 58, 237, 0.16)"
        gradientTo="rgba(237, 233, 254, 0.28)"
        gradientSize={220}
        gradientColor="rgba(124, 58, 237, 0.12)"
        gradientOpacity={0.2}
      >
        <div className={styles.media}>
          <div className={styles.mediaInner}>
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt=""
                width={800}
                height={600}
                className={imageClassName}
                sizes="(max-width: 768px) 100vw, 640px"
              />
            ) : (
              <PlaceholderBlock label={project.title} ratio="4/3" />
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.meta}>
            <span className={`display-md ${styles.title}`}>{project.title}</span>
            <CategoryTag>{categoryLabel(project.category)}</CategoryTag>
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}

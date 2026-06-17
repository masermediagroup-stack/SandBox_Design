import type { Metadata } from "next";

import { site } from "@/data/site";
import { getProjectsByCategory } from "@/lib/projects";

import { ProjectWheel } from "@/components/ui/ProjectWheel";

import styles from "@/styles/work-page.module.css";

export const metadata: Metadata = {
  title: "Web Design",
};

export default function WebDesignPage() {
  const items = getProjectsByCategory("web-design");

  return (
    <div>
      <header className={styles.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Web Design</h1>
      </header>
      <aside className={styles.banner} role="note">
        {site.webDesignDisclaimer.map((line) => (
          <p key={line} className="body-sm text-[var(--text-muted)]">
            {line}
          </p>
        ))}
      </aside>
      <ProjectWheel projects={items} emptyLabel="Web Design projects" />
    </div>
  );
}

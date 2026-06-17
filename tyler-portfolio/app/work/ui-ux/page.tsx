import type { Metadata } from "next";

import { site } from "@/data/site";
import { getProjectsByCategory } from "@/lib/projects";

import { ProjectWheel } from "@/components/ui/ProjectWheel";

import sub from "@/styles/subpage.module.css";

export const metadata: Metadata = {
  title: "UI/UX",
};

export default function UiUxPage() {
  const items = getProjectsByCategory("ui-ux");

  return (
    <div>
      <header className={sub.header}>
        <h1 className="display-lg text-[var(--text-primary)]">UI/UX</h1>
        <p className="body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
          {site.uiUxIntro}
        </p>
      </header>
      <ProjectWheel projects={items} emptyLabel="UI/UX projects" />
    </div>
  );
}

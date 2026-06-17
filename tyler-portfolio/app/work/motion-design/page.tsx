import type { Metadata } from "next";

import { getProjectsByCategory } from "@/lib/projects";

import { ProjectWheel } from "@/components/ui/ProjectWheel";

import sub from "@/styles/subpage.module.css";

export const metadata: Metadata = {
  title: "Motion Design",
};

export default function MotionDesignPage() {
  const items = getProjectsByCategory("motion-design");

  return (
    <div>
      <header className={sub.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Motion Design</h1>
        <p className="body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
          Animated brand moments, graphics, and motion-led visual systems.
        </p>
      </header>
      <ProjectWheel projects={items} emptyLabel="Motion Design projects" />
    </div>
  );
}

import type { Metadata } from "next";

import { site } from "@/data/site";
import { getProjectsByCategory } from "@/lib/projects";

import { ProjectWheel } from "@/components/ui/ProjectWheel";

import sub from "@/styles/subpage.module.css";

export const metadata: Metadata = {
  title: "Social Media",
};

export default function SocialMediaPage() {
  const items = getProjectsByCategory("social-media");

  return (
    <div>
      <header className={sub.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Social Media</h1>
        <p className="body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
          {site.socialMediaIntro}
        </p>
      </header>
      <ProjectWheel projects={items} emptyLabel="Social Media projects" />
    </div>
  );
}

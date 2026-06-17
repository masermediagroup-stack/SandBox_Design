import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/styles/brand-overview.module.css";

export const metadata: Metadata = {
  title: "Work",
};

const categories = [
  {
    href: "/work/web-design",
    label: "Web Design",
    desc: "Sites, landing pages, and digital experiences built for launch.",
  },
  {
    href: "/work/brand-design",
    label: "Brand Design",
    desc: "Logo work, identity systems, and social media design.",
  },
  {
    href: "/work/marketing",
    label: "Marketing",
    desc: "Campaign direction, launch assets, and market-focused creative.",
  },
  {
    href: "/work/motion-design",
    label: "Motion Design",
    desc: "Animated brand moments, graphics, and motion-led visual systems.",
  },
  {
    href: "/work/thumbnail",
    label: "Thumbnail",
    desc: "Video thumbnails and click-ready creative for content.",
  },
  {
    href: "/work/ui-ux",
    label: "UI/UX",
    desc: "Interfaces, components, and product design systems.",
  },
] as const;

export default function WorkPage() {
  return (
    <div>
      <header className={styles.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Work</h1>
        <p className="body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
          Browse Tyler Vea&apos;s work by category.
        </p>
      </header>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.href}>
            <Link href={category.href} className={styles.card}>
              <span className="display-md text-[var(--text-primary)]">
                {category.label}
              </span>
              <span className="body-md text-[var(--text-muted)]">
                {category.desc}
              </span>
              <span className="label-sm text-[var(--portfolio-accent)]">Open</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

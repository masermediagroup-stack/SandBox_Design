"use client";

import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { cn } from "@/lib/utils";

import styles from "@/styles/sidebar.module.css";

const workLinks = [
  { href: "/work/web-design", label: "Web Design" },
  { href: "/work/marketing", label: "Marketing" },
  { href: "/work/motion-design", label: "Motion Design" },
] as const;

const brandSubLinks = [
  { href: "/work/brand-design/logos", label: "Logos" },
  { href: "/work/brand-design/brand-identities", label: "Brand Identities" },
  { href: "/work/brand-design/social-media", label: "Social Media" },
] as const;

function BrandDesignNav({
  pathname,
  isActive,
}: {
  pathname: string;
  isActive: (href: string) => boolean;
}) {
  const onBrandPath = brandSubLinks.some((l) => pathname.startsWith(l.href));
  const [brandOpen, setBrandOpen] = useState(onBrandPath);

  return (
    <li>
      <div className={styles.brandRow}>
        <Link
          href="/work/brand-design"
          className={`body-md ${styles.brandLink} ${pathname === "/work/brand-design" ? styles.navLinkActive : ""}`}
        >
          <span className={styles.navLabel}>Brand Design</span>
        </Link>
        <button
          type="button"
          className={styles.brandToggle}
          onClick={() => setBrandOpen((o) => !o)}
          aria-expanded={brandOpen}
          aria-label={brandOpen ? "Collapse Brand Design links" : "Expand Brand Design links"}
        >
          <span
            className={`${styles.arrow} ${brandOpen ? styles.arrowOpen : ""}`}
            aria-hidden
          >
            ▸
          </span>
        </button>
      </div>
      <ul className={`${styles.subList} ${brandOpen ? styles.subListOpen : ""}`}>
        {brandSubLinks.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`${styles.subLink} ${isActive(l.href) ? styles.subLinkActive : ""}`}
            >
              <span className={styles.navLabel}>{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className={styles.aside}>
      <div className={styles.block}>
        <Link href="/" aria-label="Home" className={styles.logoLink}>
          <span className={styles.logoDither}>
            <Image
              src="/images/logo-mark-black.png"
              alt=""
              width={3418}
              height={1506}
              priority
              quality={100}
              sizes="(max-width: 1023px) 80px, 96px"
              className={styles.logoImage}
            />
          </span>
        </Link>

        <div>
          <p className={styles.name}>{site.name}</p>
          <p className={`body-sm ${styles.mutedSecondary}`}>{site.titleLine}</p>
          {site.subtitleLine ? (
            <p className={`body-sm ${styles.mutedSecondary}`}>{site.subtitleLine}</p>
          ) : null}
        </div>

        <p className={`body-sm ${styles.bio}`}>{site.shortBio}</p>

        <nav aria-label="Primary">
          <p className={`label-sm ${styles.navMuted} ${styles.navHeader}`}>
            {site.navSectionWork}
          </p>
          <ul className={styles.navList}>
            {workLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`body-md ${styles.navLink} ${isActive(l.href) ? styles.navLinkActive : ""}`}
                >
                  <span className={styles.navLabel}>{l.label}</span>
                </Link>
              </li>
            ))}
            <BrandDesignNav key={pathname} pathname={pathname} isActive={isActive} />
            <li>
              <Link
                href="/work/thumbnail"
                className={`body-md ${styles.navLink} ${isActive("/work/thumbnail") ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navLabel}>Thumbnail</span>
              </Link>
            </li>
            <li>
              <Link
                href="/work/ui-ux"
                className={`body-md ${styles.navLink} ${isActive("/work/ui-ux") ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navLabel}>UI/UX</span>
              </Link>
            </li>
          </ul>
        </nav>

        <hr className={styles.divider} />

        <div className="flex flex-col gap-2">
          <a className={`body-sm ${styles.contactLink}`} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a
            className={`body-sm ${styles.contactLink}`}
            href={site.twitterUrl}
            target="_blank"
            rel="noreferrer"
          >
            {site.twitterLabel}
          </a>
          <a
            className={`body-sm ${styles.contactLink}`}
            href={site.linkedInUrl}
            target="_blank"
            rel="noreferrer"
          >
            {site.linkedInLabel}
          </a>
          <div className={styles.badge}>
            <span className={`label-sm ${styles.navMuted}`}>{site.availability}</span>
          </div>
          <InteractiveHoverButton
            type="button"
            onClick={() => router.push("/contact")}
            aria-label={`${site.contactCta} — contact page`}
            className={cn(
              "w-full max-w-full border-[var(--border-line)] text-sm text-[var(--text-primary)] shadow-none",
              pathname === "/contact" &&
                "ring-2 ring-[var(--portfolio-accent)] ring-offset-2 ring-offset-[var(--bg-primary)]",
            )}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            {site.contactCta}
          </InteractiveHoverButton>
        </div>
      </div>
    </aside>
  );
}

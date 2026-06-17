"use client";

import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "@/styles/mobile-nav.module.css";
import sidebarStyles from "@/styles/sidebar.module.css";

const links = [
  { href: "/work/web-design", label: "Web Design" },
  { href: "/work/ui-ux", label: "UI/UX" },
  { href: "/work/brand-design", label: "Brand Design" },
  { href: "/work/brand-design/logos", label: "Logos" },
  { href: "/work/brand-design/brand-identities", label: "Brand Identities" },
  { href: "/work/brand-design/social-media", label: "Social Media" },
  { href: "/work/thumbnail", label: "Thumbnail" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className={styles.bar}>
        <Link href="/" aria-label="Home" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo-mark-black.png"
            alt=""
            width={3418}
            height={1506}
            priority
            quality={100}
            sizes="80px"
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
      </div>
      <button
        type="button"
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        aria-label="Close menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        aria-hidden={!open}
      >
        <div className={sidebarStyles.block}>
          <p className={sidebarStyles.name}>{site.name}</p>
          <p className={`body-sm ${sidebarStyles.mutedSecondary}`}>{site.titleLine}</p>
          <nav aria-label="Mobile primary">
            <ul className={sidebarStyles.navList}>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`body-md ${sidebarStyles.navLink} ${isActive(l.href) ? sidebarStyles.navLinkActive : ""}`}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/contact"
            className={`body-sm ${sidebarStyles.contactLink} ${pathname === "/contact" ? sidebarStyles.contactLinkActive : ""}`}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {site.contactCta}
          </Link>
          <a
            className={`body-sm ${sidebarStyles.contactLink}`}
            href={`mailto:${site.email}`}
            tabIndex={open ? 0 : -1}
          >
            {site.email}
          </a>
        </div>
      </div>
    </>
  );
}

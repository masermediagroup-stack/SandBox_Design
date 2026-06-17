import type { Metadata } from "next";

import sub from "@/styles/subpage.module.css";

export const metadata: Metadata = {
  title: "Marketing",
};

export default function MarketingPage() {
  return (
    <div>
      <header className={sub.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Marketing</h1>
        <p className="body-lg mt-6 max-w-2xl text-[var(--text-secondary)]">
          Campaign direction, launch assets, and market-focused creative work.
        </p>
      </header>
    </div>
  );
}

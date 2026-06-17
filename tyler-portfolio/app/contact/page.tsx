import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/layout/ContactForm";
import { site } from "@/data/site";

import workStyles from "@/styles/work-page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a message to Tyler Vea — Design Engineer.",
};

export default function ContactPage() {
  return (
    <div>
      <header className={workStyles.header}>
        <h1 className="display-lg text-[var(--text-primary)]">Contact</h1>
        <p className="body-md mt-3 max-w-xl text-[var(--text-muted)]">
          Use the form below to open an email draft for project inquiries or
          collaborations. You can also email Tyler directly at{" "}
          <Link
            href={`mailto:${site.email}`}
            className="font-bold text-[var(--portfolio-accent)] underline-offset-4 hover:underline"
          >
            {site.email}
          </Link>
          .
        </p>
      </header>
      <ContactForm />
    </div>
  );
}

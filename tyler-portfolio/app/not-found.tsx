import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center gap-6">
      <h1 className="display-lg text-[var(--text-primary)]">Page not found</h1>
      <p className="body-md text-[var(--text-muted)]">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        href="/"
        className="rounded-[2px] bg-[var(--portfolio-accent)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--portfolio-accent-hover)]"
      >
        Back home
      </Link>
    </div>
  );
}

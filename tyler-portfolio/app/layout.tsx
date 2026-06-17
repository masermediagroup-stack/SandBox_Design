import type { Metadata } from "next";
import { Raleway, Roboto } from "next/font/google";

import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { Preloader } from "@/components/effects/Preloader";
import { PortfolioShell } from "@/components/layout/PortfolioShell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

import "./globals.css";

const preloaderBootScript = `
try {
  var key = "tyler-portfolio-block-decay-loader-v1";
  var done = window.localStorage && window.localStorage.getItem(key) === "1";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smoothCursor =
    window.matchMedia &&
    window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches &&
    !reduced;
  if (smoothCursor) {
    document.documentElement.classList.add("has-smooth-cursor");
  }
  if (done || reduced) {
    document.documentElement.dataset.preloaderComplete = "true";
  }
} catch (error) {}
`;

const raleway = Raleway({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tyler Vea — Design Engineer",
    template: "%s · Tyler Vea",
  },
  description:
    "Creating from Central Texas, building brands, websites, and visual identities for startups and creators.",
  icons: {
    icon: "/images/logo-star.svg",
  },
  openGraph: {
    title: "Tyler Vea — Design Engineer",
    description:
      "Creating from Central Texas, building brands, websites, and visual identities for startups and creators.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${raleway.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderBootScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="h-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]"
      >
        <ThemeProvider>
          <a href="#main-content" className="sr-only">
            Skip to content
          </a>
          <Preloader />
          <SmoothCursor />
          <NoiseOverlay />
          <PortfolioShell>{children}</PortfolioShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

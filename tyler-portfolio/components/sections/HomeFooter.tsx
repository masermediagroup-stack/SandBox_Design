"use client";

import { Globe } from "@/components/ui/globe";

import styles from "@/styles/home-footer.module.css";

/**
 * Full-bleed zoomed globe. Negative `margin-bottom` cancels `.scroll` bottom padding
 * from `shell.module.css` so the globe isn’t stranded above a white band.
 */
export function HomeFooter() {
  return (
    <footer className="relative overflow-x-clip overflow-y-visible pb-0 mb-[-48px] lg:mb-[-64px]">
      <h2 className={styles.heading}>Satisfied Globally</h2>
      <div
        className="relative left-1/2 h-[min(46vw,380px)] w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden sm:h-[min(40vw,340px)]"
        aria-hidden
      >
        <div className="relative mx-auto h-full w-full">
          <div className="absolute bottom-0 left-1/2 z-10 aspect-square w-[min(101vw,85svh)] max-w-none -translate-x-1/2 translate-y-[54%] sm:w-[min(94vw,78svh)]">
            <Globe className="max-w-none" />
          </div>
        </div>
      </div>
    </footer>
  );
}

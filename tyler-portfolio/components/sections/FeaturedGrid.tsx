"use client";

import { getFeaturedProjects } from "@/lib/projects";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Marquee } from "@/components/ui/marquee";
import { WordRotate } from "@/components/ui/word-rotate";

import gridStyles from "@/styles/featured-grid.module.css";

const tools = ["Figma", "After Effects", "Illustrator", "Photoshop", "Framer", "Next.js"];
const audienceWords = ["clients", "teams", "startups", "companies"];

function findScrollRoot(start: HTMLElement | null) {
  let node = start?.parentElement ?? null;

  while (node) {
    const style = window.getComputedStyle(node);
    if (
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

type LenisHandle = {
  scrollTo: (
    target: number,
    options?: { immediate?: boolean; duration?: number },
  ) => void;
};

function scrollToWithGsap(scrollRoot: HTMLElement, target: number) {
  const lenis = (scrollRoot as HTMLElement & { __tylerLenis?: LenisHandle })
    .__tylerLenis;
  const proxy = { value: scrollRoot.scrollTop };

  return gsap.to(proxy, {
    value: target,
    duration: 0.72,
    ease: "power3.out",
    overwrite: true,
    onUpdate: () => {
      if (lenis) {
        lenis.scrollTo(proxy.value, { immediate: true });
      } else {
        scrollRoot.scrollTop = proxy.value;
      }
    },
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FeaturedGrid() {
  const featured = getFeaturedProjects();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isSnappingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const scrollRoot = findScrollRoot(section);
    if (!scrollRoot) return;

    const items = () => itemRefs.current.filter(Boolean) as HTMLDivElement[];
    const cardForItem = (item: HTMLDivElement) =>
      item.querySelector<HTMLElement>('a[href^="/project/"]') ?? item;
    let transformFrame = 0;

    const progressForItem = (item: HTMLDivElement) => {
      const scrollRect = scrollRoot.getBoundingClientRect();
      const scrollCenter = scrollRect.top + scrollRoot.clientHeight / 2;
      const progressRange = Math.max(320, scrollRoot.clientHeight * 0.62);
      const rect = cardForItem(item).getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;

      return clamp((cardCenter - scrollCenter) / progressRange, -1.35, 1.35);
    };

    const updateCarouselTransforms = () => {
      transformFrame = 0;
      const currentItems = items();
      if (!currentItems.length) return;

      currentItems.forEach((item) => {
        const progress = progressForItem(item);
        const absProgress = Math.min(Math.abs(progress), 1);
        const desktop = window.matchMedia("(min-width: 768px)").matches;
        const wheelTilt = desktop ? 18 : 10;
        const wheelLift = desktop ? 28 : 14;
        const wheelDepth = desktop ? 180 : 96;
        const scaleFalloff =
          progress < 0
            ? desktop
              ? 0.18
              : 0.11
            : desktop
              ? 0.1
              : 0.065;

        item.style.setProperty("--carousel-progress", progress.toFixed(4));
        item.style.setProperty("--carousel-abs", absProgress.toFixed(4));
        item.style.setProperty("--carousel-side", String(Math.sign(progress)));
        item.style.setProperty(
          "--carousel-y",
          `${(progress * wheelLift).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--carousel-depth",
          `${(-absProgress * wheelDepth).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--carousel-tilt-x",
          `${(progress * -wheelTilt).toFixed(2)}deg`,
        );
        item.style.setProperty("--carousel-tilt-y", "0deg");
        item.style.setProperty(
          "--carousel-scale",
          (1 - absProgress * scaleFalloff).toFixed(4),
        );
        item.style.setProperty("--carousel-opacity", (1 - absProgress * 0.18).toFixed(4));
        item.style.setProperty(
          "--carousel-origin",
          progress < 0 ? "50% 85%" : progress > 0 ? "50% 15%" : "50% 50%",
        );
        item.style.setProperty("--carousel-media-y", `${(-progress * 18).toFixed(2)}px`);
        item.style.setProperty(
          "--carousel-media-scale",
          (1.005 - absProgress * 0.006).toFixed(4),
        );
      });
    };

    const requestCarouselTransformUpdate = () => {
      if (transformFrame) return;
      transformFrame = window.requestAnimationFrame(updateCarouselTransforms);
    };

    const setActive = (index: number) => {
      activeIndexRef.current = index;
    };

    const nearestIndex = () => {
      const currentItems = items();
      if (!currentItems.length || !scrollRoot) return 0;
      const scrollRect = scrollRoot.getBoundingClientRect();
      const scrollCenter = scrollRect.top + scrollRoot.clientHeight / 2;

      return currentItems.reduce(
        (nearest, item, index) => {
          const rect = cardForItem(item).getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - scrollCenter);
          return distance < nearest.distance ? { index, distance } : nearest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;
    };

    const scrollToProject = (index: number, immediate = false) => {
      const currentItems = items();
      const targetItem = currentItems[index];
      if (!targetItem || !scrollRoot) return;
      const targetCard = cardForItem(targetItem);

      const scrollRect = scrollRoot.getBoundingClientRect();
      const itemRect = targetCard.getBoundingClientRect();
      const target =
        scrollRoot.scrollTop +
        itemRect.top -
        scrollRect.top -
        Math.max(0, (scrollRoot.clientHeight - itemRect.height) / 2);
      const max = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      const clampedTarget = Math.max(0, Math.min(target, max));

      setActive(index);

      if (immediate) {
        scrollRoot.scrollTop = clampedTarget;
        return;
      }

      isSnappingRef.current = true;
      scrollToWithGsap(scrollRoot, clampedTarget).eventCallback("onComplete", () => {
        isSnappingRef.current = false;
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8 || isSnappingRef.current) return;

      const currentItems = items();
      if (!currentItems.length) return;

      const current = nearestIndex();
      const direction = event.deltaY > 0 ? 1 : -1;

      if (direction > 0 && current === 0 && progressForItem(currentItems[0]) > 0.16) {
        event.preventDefault();
        scrollToProject(0);
        return;
      }

      const next = current + direction;

      if (next < 0 || next >= currentItems.length) return;

      event.preventDefault();
      scrollToProject(next);
    };

    const onScroll = () => {
      requestCarouselTransformUpdate();
      if (isSnappingRef.current) return;
      const index = nearestIndex();
      if (index !== activeIndexRef.current) setActive(index);
    };

    grid.addEventListener("wheel", onWheel, { passive: false });
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    updateCarouselTransforms();
    onScroll();

    return () => {
      if (transformFrame) window.cancelAnimationFrame(transformFrame);
      grid.removeEventListener("wheel", onWheel);
      scrollRoot?.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(scrollRoot);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-work"
      className={gridStyles.section}
      aria-labelledby="featured-heading"
    >
      <div className={gridStyles.intro}>
        <div className={gridStyles.stats}>
          <p className="label-sm leading-snug text-[var(--text-muted)]">
            Selected work
          </p>
          <div className={gridStyles.statsRow}>
            <div className="font-heading text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              <NumberTicker value={7} delay={0.15} />+ years of practice
            </div>
            <div
              className="inline-flex items-baseline gap-1.5 font-heading text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl"
              aria-label="75+ clients, teams, startups, and companies"
            >
              <span>
                <NumberTicker value={75} delay={0.22} />+
              </span>
              <WordRotate
                className="min-w-[5.9em] text-left"
                words={audienceWords}
              />
            </div>
          </div>
        </div>
        <div className={gridStyles.marqueeShell}>
          <Marquee pauseOnHover className="[--duration:40s]">
            {tools.map((t) => (
              <span
                key={t}
                className="mx-4 text-xs font-medium text-[var(--text-muted)]"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>
        <h2 id="featured-heading" className={gridStyles.heading}>
          Featured work
        </h2>
      </div>
      <div className={gridStyles.carouselShell}>
        <div ref={gridRef} className={gridStyles.grid}>
        {featured.map((p, index) => (
          <div
            key={p.slug}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={gridStyles.gridItem}
          >
            <div className={gridStyles.carouselStage}>
              <ProjectCard project={p} />
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

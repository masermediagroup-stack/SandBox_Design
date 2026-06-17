"use client";

import type { Project } from "@/data/projects";
import gsap from "gsap";
import { useEffect, useRef } from "react";

import { ProjectCard } from "@/components/ui/ProjectCard";

import styles from "@/styles/project-wheel.module.css";

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

type ProjectWheelProps = {
  projects: Project[];
  emptyLabel: string;
};

export function ProjectWheel({ projects, emptyLabel }: ProjectWheelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isSnappingRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    if (!section || !wheel) return;

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

    const updateWheelTransforms = () => {
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
        item.style.setProperty("--carousel-y", `${(progress * wheelLift).toFixed(2)}px`);
        item.style.setProperty(
          "--carousel-depth",
          `${(-absProgress * wheelDepth).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--carousel-tilt-x",
          `${(progress * -wheelTilt).toFixed(2)}deg`,
        );
        item.style.setProperty(
          "--carousel-scale",
          (1 - absProgress * scaleFalloff).toFixed(4),
        );
        item.style.setProperty(
          "--carousel-opacity",
          (1 - absProgress * 0.18).toFixed(4),
        );
        item.style.setProperty(
          "--carousel-origin",
          progress < 0 ? "50% 85%" : progress > 0 ? "50% 15%" : "50% 50%",
        );
        item.style.setProperty("--carousel-media-y", `${(-progress * 18).toFixed(2)}px`);
        item.style.setProperty(
          "--carousel-media-scale",
          (1.035 - absProgress * 0.018).toFixed(4),
        );
      });
    };

    const requestWheelTransformUpdate = () => {
      if (transformFrame) return;
      transformFrame = window.requestAnimationFrame(updateWheelTransforms);
    };

    const nearestIndex = () => {
      const currentItems = items();
      if (!currentItems.length) return 0;
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

    const scrollToProject = (index: number) => {
      const currentItems = items();
      const targetItem = currentItems[index];
      if (!targetItem) return;
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

      activeIndexRef.current = index;
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
      requestWheelTransformUpdate();
      if (isSnappingRef.current) return;
      activeIndexRef.current = nearestIndex();
    };

    wheel.addEventListener("wheel", onWheel, { passive: false });
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    updateWheelTransforms();
    onScroll();

    return () => {
      if (transformFrame) window.cancelAnimationFrame(transformFrame);
      wheel.removeEventListener("wheel", onWheel);
      scrollRoot.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(scrollRoot);
    };
  }, [projects.length]);

  if (!projects.length) {
    return <p className={styles.empty}>{emptyLabel}</p>;
  }

  return (
    <section ref={sectionRef} className={styles.section} aria-label={emptyLabel}>
      <div ref={wheelRef} className={styles.wheel}>
        {projects.map((project, index) => (
          <div
            key={project.slug}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={styles.item}
          >
            <div className={styles.stage}>
              <ProjectCard project={project} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

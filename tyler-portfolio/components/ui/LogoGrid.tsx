"use client";

import type { LogoItem } from "@/data/projects";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { PlaceholderBlock } from "@/components/ui/PlaceholderBlock";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import styles from "@/styles/logo-grid.module.css";

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

export function LogoGrid({ items }: { items: LogoItem[] }) {
  const [active, setActive] = useState<LogoItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isSnappingRef = useRef(false);

  const onOpen = useCallback((item: LogoItem) => {
    setActive(item);
  }, []);

  const onClose = useCallback(() => setActive(null), []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const scrollRoot = findScrollRoot(carousel);
    if (!scrollRoot) return;

    const currentItems = () =>
      itemRefs.current.filter(Boolean) as HTMLDivElement[];
    const cardForItem = (item: HTMLDivElement) =>
      item.querySelector<HTMLElement>("button") ?? item;
    let transformFrame = 0;

    const progressForItem = (item: HTMLDivElement) => {
      const scrollRect = scrollRoot.getBoundingClientRect();
      const scrollCenter = scrollRect.top + scrollRoot.clientHeight / 2;
      const progressRange = Math.max(320, scrollRoot.clientHeight * 0.62);
      const rect = cardForItem(item).getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;

      return clamp((cardCenter - scrollCenter) / progressRange, -1.35, 1.35);
    };

    const updateLogoTransforms = () => {
      transformFrame = 0;
      const current = currentItems();
      if (!current.length) return;

      current.forEach((item) => {
        const progress = progressForItem(item);
        const absProgress = Math.min(Math.abs(progress), 1);
        const desktop = window.matchMedia("(min-width: 768px)").matches;
        const scaleFalloff =
          progress < 0
            ? desktop
              ? 0.18
              : 0.11
            : desktop
              ? 0.1
              : 0.065;

        item.style.setProperty("--logo-progress", progress.toFixed(4));
        item.style.setProperty("--logo-abs", absProgress.toFixed(4));
        item.style.setProperty(
          "--logo-y",
          `${(progress * (desktop ? 28 : 14)).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--logo-depth",
          `${(-absProgress * (desktop ? 180 : 96)).toFixed(2)}px`,
        );
        item.style.setProperty(
          "--logo-tilt-x",
          `${(progress * (desktop ? -18 : -10)).toFixed(2)}deg`,
        );
        item.style.setProperty(
          "--logo-scale",
          (1 - absProgress * scaleFalloff).toFixed(4),
        );
        item.style.setProperty("--logo-opacity", (1 - absProgress * 0.18).toFixed(4));
        item.style.setProperty(
          "--logo-origin",
          progress < 0 ? "50% 85%" : progress > 0 ? "50% 15%" : "50% 50%",
        );
        item.style.setProperty("--logo-image-y", `${(-progress * 16).toFixed(2)}px`);
        item.style.setProperty(
          "--logo-image-scale",
          (1.045 - absProgress * 0.018).toFixed(4),
        );
      });
    };

    const requestLogoTransformUpdate = () => {
      if (transformFrame) return;
      transformFrame = window.requestAnimationFrame(updateLogoTransforms);
    };

    const nearestIndex = () => {
      const current = currentItems();
      if (!current.length) return 0;
      const scrollRect = scrollRoot.getBoundingClientRect();
      const scrollCenter = scrollRect.top + scrollRoot.clientHeight / 2;

      return current.reduce(
        (nearest, item, index) => {
          const rect = cardForItem(item).getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - scrollCenter);
          return distance < nearest.distance ? { index, distance } : nearest;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY },
      ).index;
    };

    const scrollToLogo = (index: number) => {
      const current = currentItems();
      const targetItem = current[index];
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

      const current = currentItems();
      if (!current.length) return;

      const nearest = nearestIndex();
      const direction = event.deltaY > 0 ? 1 : -1;

      if (direction > 0 && nearest === 0 && progressForItem(current[0]) > 0.16) {
        event.preventDefault();
        scrollToLogo(0);
        return;
      }

      const next = nearest + direction;
      if (next < 0 || next >= current.length) return;

      event.preventDefault();
      scrollToLogo(next);
    };

    const onScroll = () => {
      requestLogoTransformUpdate();
      if (isSnappingRef.current) return;
      activeIndexRef.current = nearestIndex();
    };

    carousel.addEventListener("wheel", onWheel, { passive: false });
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    updateLogoTransforms();
    onScroll();

    return () => {
      if (transformFrame) window.cancelAnimationFrame(transformFrame);
      carousel.removeEventListener("wheel", onWheel);
      scrollRoot.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(scrollRoot);
    };
  }, []);

  return (
    <>
      <div ref={carouselRef} className={styles.carousel}>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={styles.item}
          >
            <div className={styles.stage}>
              <button
                type="button"
                className={styles.cell}
                onClick={() => onOpen(item)}
              >
                <div className={styles.logoWrap}>
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={`${item.client} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className={styles.logoImage}
                    />
                  ) : (
                    <PlaceholderBlock label={item.client} ratio="4/3" />
                  )}
                </div>
                <div className={styles.footer}>
                  <div className={styles.footerMeta}>
                    <span className={`display-md ${styles.title}`}>{item.client}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className={styles.previewDialog}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {active ? `${active.client} logo` : "Logo"}
          </DialogTitle>
          {active ? (
            <div className={styles.preview}>
              <div className={styles.previewMedia}>
                {active.src ? (
                  <Image
                    src={active.src}
                    alt={`${active.client} logo`}
                    fill
                    sizes="(max-width: 768px) 90vw, 480px"
                    className={styles.previewImage}
                  />
                ) : (
                  <PlaceholderBlock label={active.client} ratio="4/3" />
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

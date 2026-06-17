"use client";

import gsap from "gsap";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { hasCompletedPreloader, markPreloaderComplete } from "@/lib/preloader-state";
import loaderStyles from "@/styles/preloader-loader.module.css";

type BlockCell = {
  id: number;
  driftX: number;
  driftY: number;
  rotate: number;
};

type BlockField = {
  cells: BlockCell[];
  columns: number;
  rows: number;
};

function buildCells(width: number, height: number): BlockField {
  const maxCells = width < 720 ? 260 : 560;
  const minimumBlockSize = width < 720 ? 48 : 42;
  const blockSize = Math.max(
    minimumBlockSize,
    Math.ceil(Math.sqrt((width * height) / maxCells))
  );
  const columns = Math.ceil(width / blockSize);
  const rows = Math.ceil(height / blockSize);
  const centerX = (columns - 1) / 2;
  const centerY = (rows - 1) / 2;
  const maxDistance = Math.hypot(centerX, centerY) || 1;

  const cells = Array.from({ length: columns * rows }, (_, id) => {
    const x = id % columns;
    const y = Math.floor(id / columns);
    const distance = Math.hypot(x - centerX, y - centerY) / maxDistance;
    const angle = Math.atan2(y - centerY, x - centerX);
    const push = 12 + distance * 24;

    return {
      id,
      driftX: Math.cos(angle) * push + (Math.random() - 0.5) * 18,
      driftY: Math.sin(angle) * push + (Math.random() - 0.5) * 18,
      rotate: (Math.random() - 0.5) * 18,
    };
  });

  return { cells, columns, rows };
}

export function Preloader() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);
  const [field, setField] = useState<BlockField>({
    cells: [],
    columns: 1,
    rows: 1,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markPreloaderComplete();
      const id = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(id);
    }
    if (hasCompletedPreloader()) {
      const id = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(id);
    }

    const id = requestAnimationFrame(() => {
      setField(buildCells(window.innerWidth, window.innerHeight));
      setReady(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!show || !ready || !rootRef.current) return;

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-loader-block]");

      gsap.set(rootRef.current, {
        opacity: 1,
      });

      gsap.set(blocks, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(logoRef.current, {
        opacity: 1,
        scale: 12,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({
        onComplete: () => {
          markPreloaderComplete();
          setShow(false);
        },
      });

      tl.to(logoRef.current, {
        scale: 1,
        duration: 0.36,
        ease: "expo.out",
      }, 0.18)
        .to(logoRef.current, {
          opacity: 0,
          scale: 0.88,
          duration: 0.9,
          ease: "power2.out",
        }, 0.7)
        .to(blocks, {
          opacity: 0,
          scale: 0.58,
          x: (index) => field.cells[index]?.driftX ?? 0,
          y: (index) => field.cells[index]?.driftY ?? 0,
          rotate: (index) => field.cells[index]?.rotate ?? 0,
          duration: 0.92,
          ease: "power3.inOut",
          stagger: {
            from: "center",
            amount: 0.62,
          },
        }, 0.64)
        .to(rootRef.current, {
          opacity: 0,
          duration: 0.16,
          ease: "none",
        }, 1.88);
    }, rootRef);

    return () => {
      ctx.kill();
      ctx.revert();
    };
  }, [field.cells, ready, show]);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className={loaderStyles.root}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className={loaderStyles.blocks}
        style={{
          "--loader-columns": field.columns,
          "--loader-rows": field.rows,
        } as CSSProperties}
        aria-hidden
      >
        {field.cells.map((cell) => (
          <span
            key={cell.id}
            className={loaderStyles.block}
            data-loader-block
          />
        ))}
      </div>
      <div ref={logoRef} className={loaderStyles.logoWrap} aria-hidden>
        <Image
          src="/images/logo-mark-color-2x.png"
          alt=""
          width={3935}
          height={1733}
          priority
          unoptimized
          className={loaderStyles.logo}
        />
      </div>
      <span className="sr-only">Loading Tyler Vea portfolio</span>
    </div>
  );
}

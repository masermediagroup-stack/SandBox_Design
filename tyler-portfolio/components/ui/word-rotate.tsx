"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type WordRotateProps = {
  words: string[];
  className?: string;
  duration?: number;
};

export function WordRotate({
  words,
  className,
  duration = 2200,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || words.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, duration);

    return () => window.clearInterval(interval);
  }, [duration, prefersReducedMotion, words.length]);

  if (words.length === 0) return null;

  return (
    <span
      className={cn("relative inline-grid overflow-hidden align-baseline", className)}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={prefersReducedMotion ? words[0] : words[index]}
          className="col-start-1 row-start-1 inline-block whitespace-nowrap"
          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{ type: "spring", duration: 0.42, bounce: 0 }}
          aria-hidden="true"
        >
          {prefersReducedMotion ? words[0] : words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

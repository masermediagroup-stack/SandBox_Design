"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

type TextAnimateProps = {
  children: string;
  animation?: "blurInUp";
  by?: "character" | "word";
  once?: boolean;
  className?: string;
};

const blurInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

function splitWords(text: string) {
  return text.split(/(\s+)/).filter(Boolean);
}

export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "word",
  once = false,
  className,
}: TextAnimateProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once, margin: "-10% 0px" });
  const variants = animation === "blurInUp" ? blurInUp : blurInUp;

  const text = useMemo(() => children.replace(/\s+/g, " ").trim(), [children]);
  const words = useMemo(() => splitWords(text), [text]);
  const shouldAnimate = !prefersReducedMotion && isInView;
  let characterIndex = 0;

  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          if (/^\s+$/.test(word)) return word;

          if (by === "word") {
            return (
              <motion.span
                key={`${word}-${wordIndex}`}
                className="inline-block whitespace-nowrap"
                initial="hidden"
                animate={shouldAnimate ? "visible" : "hidden"}
                variants={variants}
                transition={{
                  type: "spring",
                  duration: 0.55,
                  bounce: 0,
                  delay: wordIndex * 0.035,
                }}
              >
                {word}
              </motion.span>
            );
          }

          return (
            <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
              {Array.from(word).map((character) => {
                const delay = characterIndex * 0.012;
                characterIndex += 1;

                return (
                  <motion.span
                    key={`${character}-${characterIndex}`}
                    className="inline-block"
                    initial="hidden"
                    animate={shouldAnimate ? "visible" : "hidden"}
                    variants={variants}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0,
                      delay,
                    }}
                  >
                    {character}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
}

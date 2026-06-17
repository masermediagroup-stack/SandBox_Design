"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  hasCompletedPreloader,
  PRELOADER_COMPLETE_EVENT,
} from "@/lib/preloader-state";

type LazyHeroShaderProps = {
  className?: string;
};

const HeroShader = dynamic(
  () => import("@/components/effects/HeroShader").then((mod) => mod.HeroShader),
  { ssr: false }
);

export function LazyHeroShader({ className }: LazyHeroShaderProps) {
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    const updateLoaderComplete = () => setLoaderComplete(true);

    if (hasCompletedPreloader()) {
      const id = requestAnimationFrame(updateLoaderComplete);
      return () => cancelAnimationFrame(id);
    }

    window.addEventListener(PRELOADER_COMPLETE_EVENT, updateLoaderComplete);

    return () => {
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, updateLoaderComplete);
    };
  }, []);

  if (!loaderComplete) {
    return null;
  }

  return <HeroShader className={className} />;
}

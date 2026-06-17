"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useLenis(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    (wrapper as HTMLElement & { __tylerLenis?: Lenis }).__tylerLenis = lenis;

    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return wrapper.getBoundingClientRect();
      },
      scrollHeight: () => content.scrollHeight,
    });

    ScrollTrigger.defaults({ scroller: wrapper });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = () => {
      lenis.raf(performance.now());
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      delete (wrapper as HTMLElement & { __tylerLenis?: Lenis }).__tylerLenis;
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.scrollerProxy(wrapper);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [wrapperRef, contentRef]);
}

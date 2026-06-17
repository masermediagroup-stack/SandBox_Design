"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import {
  hasCompletedPreloader,
  PRELOADER_COMPLETE_EVENT,
} from "@/lib/preloader-state"
import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.9,
  mapSamples: 16000,
  mapBrightness: 7,
  baseColor: [1, 1, 1],
  /* Match --portfolio-accent (#7c3aed) */
  markerColor: [124 / 255, 58 / 255, 237 / 255],
  glowColor: [0, 0, 0],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const [active, setActive] = useState(false)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const updateLoaderComplete = () => setLoaderComplete(true)

    if (hasCompletedPreloader()) {
      const id = requestAnimationFrame(updateLoaderComplete)
      return () => cancelAnimationFrame(id)
    }

    window.addEventListener(PRELOADER_COMPLETE_EVENT, updateLoaderComplete)

    return () => {
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, updateLoaderComplete)
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !loaderComplete) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "240px 0px", threshold: 0.01 }
    )

    observer.observe(wrap)

    return () => observer.disconnect()
  }, [loaderComplete])

  useEffect(() => {
    if (!loaderComplete || !active) return

    const canvas = canvasRef.current
    if (!canvas) return

    let rafId = 0
    let destroyed = false
    let opacityTimer = 0

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const w = Math.max(widthRef.current, 1)
    const globe = createGlobe(canvas, {
      ...config,
      width: w * 2,
      height: w * 2,
    })

    const tick = () => {
      if (destroyed) return
      if (!pointerInteracting.current) phiRef.current += 0.005
      const size = Math.max(widthRef.current, 1) * 2
      globe.update({
        phi: phiRef.current + rs.get(),
        width: size,
        height: size,
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    opacityTimer = window.setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1"
    }, 0)

    return () => {
      destroyed = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(opacityTimer)
      try {
        globe.destroy()
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "NotFoundError")) {
          throw error
        }
      }
      window.removeEventListener("resize", onResize)
    }
  }, [active, config, loaderComplete, rs])

  return (
    <div
      ref={wrapRef}
      className={cn(
        "absolute inset-0 m-auto aspect-square h-full max-h-full w-full max-w-150",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[10%] z-0 rounded-full bg-black"
      />
      {loaderComplete && (
        <canvas
          className={cn(
            "relative z-10 size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
          )}
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX
            updatePointerInteraction(e.clientX)
          }}
          onPointerUp={() => updatePointerInteraction(null)}
          onPointerOut={() => updatePointerInteraction(null)}
          onMouseMove={(e) => updateMovement(e.clientX)}
          onTouchMove={(e) =>
            e.touches[0] && updateMovement(e.touches[0].clientX)
          }
        />
      )}
    </div>
  )
}

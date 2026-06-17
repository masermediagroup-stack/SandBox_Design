"use client"

import { FC, useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useSpring } from "motion/react"

interface Position {
  x: number
  y: number
}

interface SparkleParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  bornAt: number
  lifeMs: number
  color: string
  opacity: number
}

export interface SmoothCursorProps {
  cursor?: React.ReactNode
  springConfig?: {
    damping: number
    stiffness: number
    mass: number
    restDelta: number
  }
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
const MAX_SPARKLES = 18
const SPARKLE_EMIT_INTERVAL_MS = 60
const SPARKLE_MIN_LIFE_MS = 220
const SPARKLE_MAX_LIFE_MS = 380
const SPARKLE_COLORS = [
  "rgba(167, 139, 250, 1)",
  "rgba(139, 92, 246, 1)",
] as const
const FORCE_CURSOR_STYLE_ID = "tyler-force-smooth-cursor"
const FORCE_CURSOR_CSS = `
html.has-smooth-cursor,
html.has-smooth-cursor *,
html.has-smooth-cursor *::before,
html.has-smooth-cursor *::after {
  cursor: none !important;
}
`

function isTrackablePointer(pointerType: string) {
  return pointerType !== "touch"
}

const DefaultCursorSVG: FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 34,
        height: 34,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          border: "1.5px solid rgba(0, 0, 0, 0.45)",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 8,
          height: 8,
          borderRadius: "9999px",
          backgroundColor: "rgba(0, 0, 0, 0.92)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  )
}

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 32,
    stiffness: 680,
    mass: 0.7,
    restDelta: 0.0008,
  },
}: SmoothCursorProps) {
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  const velocity = useRef<Position>({ x: 0, y: 0 })
  const lastUpdateTime = useRef(Date.now())
  const previousAngle = useRef(0)
  const accumulatedRotation = useRef(0)
  const sparklesRef = useRef<SparkleParticle[]>([])
  const sparkleIdRef = useRef(0)
  const lastSparkleEmitRef = useRef(0)
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([])
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 40,
    stiffness: 380,
  })
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 620,
    damping: 28,
  })

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_POINTER_QUERY)
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)

    const updateEnabled = () => {
      const nextIsEnabled = desktop.matches && !reducedMotion.matches
      setIsEnabled(nextIsEnabled)

      if (!nextIsEnabled) {
        setIsVisible(false)
      }
    }

    updateEnabled()
    desktop.addEventListener("change", updateEnabled)
    reducedMotion.addEventListener("change", updateEnabled)

    return () => {
      desktop.removeEventListener("change", updateEnabled)
      reducedMotion.removeEventListener("change", updateEnabled)
    }
  }, [])

  useLayoutEffect(() => {
    if (!isEnabled) {
      return
    }

    let style = document.getElementById(FORCE_CURSOR_STYLE_ID)
    if (!style) {
      style = document.createElement("style")
      style.id = FORCE_CURSOR_STYLE_ID
      style.textContent = FORCE_CURSOR_CSS
      document.head.appendChild(style)
    }

    document.documentElement.classList.add("has-smooth-cursor")
    document.body.style.cursor = "none"

    return () => {
      document.documentElement.classList.remove("has-smooth-cursor")
      document.body.style.cursor = ""
    }
  }, [isEnabled])

  useEffect(() => {
    if (!isEnabled) {
      sparklesRef.current = []
      setSparkles([])
      return
    }

    let timeout: ReturnType<typeof setTimeout> | null = null
    let sparkleRafId = 0

    const emitSparkle = (position: Position, speed: number) => {
      const now = performance.now()
      if (now - lastSparkleEmitRef.current < SPARKLE_EMIT_INTERVAL_MS) {
        return
      }
      lastSparkleEmitRef.current = now

      const speedFactor = Math.min(speed / 1.4, 1)
      const particle: SparkleParticle = {
        id: sparkleIdRef.current++,
        x: position.x + (Math.random() * 8 - 4),
        y: position.y + (Math.random() * 8 - 4),
        vx: velocity.current.x * -8 + (Math.random() * 0.24 - 0.12),
        vy: velocity.current.y * -8 + (Math.random() * 0.24 - 0.12),
        size: 1.8 + Math.random() * 1.6,
        bornAt: now,
        lifeMs:
          SPARKLE_MIN_LIFE_MS +
          Math.random() * (SPARKLE_MAX_LIFE_MS - SPARKLE_MIN_LIFE_MS),
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        opacity: 0.18 + speedFactor * 0.2,
      }

      const nextParticles = sparklesRef.current
        .concat(particle)
        .slice(-MAX_SPARKLES)
      sparklesRef.current = nextParticles
      setSparkles(nextParticles)
    }

    const tickSparkles = () => {
      const now = performance.now()
      const nextParticles: SparkleParticle[] = []

      for (const particle of sparklesRef.current) {
        const age = now - particle.bornAt
        if (age >= particle.lifeMs) {
          continue
        }

        const lifeProgress = age / particle.lifeMs
        nextParticles.push({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.93,
          vy: particle.vy * 0.93,
          opacity: Math.max(0, particle.opacity * (1 - lifeProgress * 0.92)),
        })
      }

      if (nextParticles.length !== sparklesRef.current.length) {
        sparklesRef.current = nextParticles
        setSparkles(nextParticles)
      } else if (nextParticles.length > 0) {
        sparklesRef.current = nextParticles
        setSparkles(nextParticles)
      }

      sparkleRafId = requestAnimationFrame(tickSparkles)
    }

    sparkleRafId = requestAnimationFrame(tickSparkles)

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        }
      }

      lastUpdateTime.current = currentTime
      lastMousePos.current = currentPos
    }

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      setIsVisible(true)

      const currentPos = { x: e.clientX, y: e.clientY }
      updateVelocity(currentPos)

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
      )

      cursorX.set(currentPos.x)
      cursorY.set(currentPos.y)

      if (speed > 0.1) {
        emitSparkle(currentPos, speed)

        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90

        let angleDiff = currentAngle - previousAngle.current
        if (angleDiff > 180) angleDiff -= 360
        if (angleDiff < -180) angleDiff += 360
        accumulatedRotation.current += angleDiff
        rotation.set(accumulatedRotation.current)
        previousAngle.current = currentAngle

        scale.set(0.95)

        if (timeout !== null) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          scale.set(1)
        }, 150)
      }
    }

    let rafId = 0
    const throttledPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return
      }

      if (rafId) return

      rafId = requestAnimationFrame(() => {
        smoothPointerMove(e)
        rafId = 0
      })
    }

    window.addEventListener("pointermove", throttledPointerMove, {
      passive: true,
    })

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove)
      if (rafId) cancelAnimationFrame(rafId)
      if (sparkleRafId) cancelAnimationFrame(sparkleRafId)
      if (timeout !== null) {
        clearTimeout(timeout)
      }
      sparklesRef.current = []
      setSparkles([])
    }
  }, [cursorX, cursorY, isEnabled, rotation, scale])

  if (!isEnabled) {
    return null
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99,
        }}
      >
        {sparkles.map((particle) => (
          <span
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: "9999px",
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: "translate(-50%, -50%)",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          rotate: rotation,
          scale: scale,
          zIndex: 100,
          pointerEvents: "none",
          willChange: "transform",
          opacity: isVisible ? 1 : 0,
        }}
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{
          duration: 0.15,
        }}
      >
        {cursor}
      </motion.div>
    </>
  )
}

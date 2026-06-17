"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  Color,
  ShaderMaterial,
  Vector2,
  type Mesh,
} from "three";

import { cn } from "@/lib/utils";
import {
  hasCompletedPreloader,
  PRELOADER_COMPLETE_EVENT,
} from "@/lib/preloader-state";

type HeroShaderProps = {
  className?: string;
};

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform vec3 uInk;
uniform vec3 uCyan;
uniform vec3 uAmber;
uniform vec3 uRose;

varying vec2 vUv;

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot(0.68) * p * 2.02 + 7.31;
    a *= 0.52;
  }

  return v;
}

float wave(vec2 p, float scale, float speed, float bend) {
  vec2 q = p;
  q.x += sin(q.y * 2.8 + uTime * speed) * bend;
  q.y += sin(q.x * 3.1 - uTime * speed * 0.74) * bend;

  float base = sin((q.x + q.y * 0.42) * scale + uTime * speed);
  float comb = sin((q.x * 1.5 - q.y * 0.72) * scale * 0.63 - uTime * speed * 1.45);

  return base * 0.65 + comb * 0.35;
}

float ribbon(vec2 p, vec2 anchor, float angle, float scale, float width, float speed) {
  vec2 q = (p - anchor) * rot(angle);
  q.y += sin(q.x * 2.35 + uTime * speed) * 0.18;
  q.x += sin(q.y * 3.4 - uTime * speed * 0.7) * 0.11;

  float crest = wave(q, scale, speed, 0.15);
  float line = abs(q.y + crest * 0.18);
  float body = smoothstep(width, 0.0, line);
  float striation = 0.55 + 0.45 * sin((q.x + crest * 0.08) * 84.0);
  float feather = smoothstep(1.3, -0.15, abs(q.x));

  return body * mix(0.62, 1.0, striation) * feather;
}

vec3 spectrum(float t) {
  vec3 a = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.34, 0.68)));
  vec3 b = mix(uCyan, uAmber, smoothstep(0.12, 0.86, t));
  return mix(a, b, 0.42);
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 p = (uv - 0.5) * aspect;
  vec2 pointer = (uPointer - 0.5) * aspect;
  vec2 pointerDelta = p - pointer;
  float pointerRadius = length(pointerDelta);
  float pointerDot = exp(-pointerRadius * pointerRadius * 760.0);
  float pointerHalo = exp(-pointerRadius * pointerRadius * 155.0);
  float pointerLight = (pointerDot * 1.08 + pointerHalo * 0.2) * uPointerActive;

  float t = uTime * 0.12;
  float grain = noise(uv * uResolution * 0.62 + uTime * 14.0);
  float field = fbm(p * 2.8 + vec2(t, -t * 0.7));
  float pointerGlow = exp(-dot(pointerDelta, pointerDelta) * 48.0) * uPointerActive;
  float pointerWarp = pointerGlow * 0.26 + pointerDot * 0.08 * uPointerActive;

  p += normalize(pointer - p + 0.0001) * pointerWarp;
  p += vec2(fbm(p * 3.2 + uTime * 0.06), fbm(p * 3.7 - uTime * 0.05)) * 0.09;

  float upper = ribbon(p, vec2(-0.02, 0.72), -0.31, 10.0, 0.12, 0.58);
  float upperSplit = ribbon(p + vec2(0.018, -0.012), vec2(-0.02, 0.72), -0.31, 10.4, 0.044, 0.6);
  float right = ribbon(p, vec2(0.78, 0.2), 1.64, 12.0, 0.19, -0.48);
  float lower = ribbon(p, vec2(-0.2, -0.58), 0.17, 8.0, 0.18, 0.52);
  float lowerHot = ribbon(p, vec2(0.18, -0.44), -0.09, 16.0, 0.05, 0.38);
  float leftSpark = ribbon(p, vec2(-0.9, -0.34), -0.72, 13.0, 0.11, 0.7);

  float energy = upper + right * 0.95 + lower * 0.88 + lowerHot * 0.72 + leftSpark * 0.65;
  float prism = upperSplit + lowerHot * 1.25 + right * 0.75;
  float darkFlow = fbm(p * 7.0 + vec2(field * 1.8, uTime * 0.04));

  vec3 color = uInk;
  color += vec3(0.012, 0.018, 0.034) * darkFlow;
  color += spectrum(field + uv.x * 0.5 + uTime * 0.03) * energy * 0.48;
  color += vec3(0.84, 0.88, 1.0) * pow(upper, 2.8) * 0.46;
  color += mix(uAmber, uRose, 0.42) * pow(right, 1.6) * 0.62;
  color += uCyan * pow(lower, 2.0) * 0.58;

  vec2 offset = vec2(0.012, -0.006) * (0.35 + prism);
  float redShift = ribbon(p + offset, vec2(-0.08, 0.44), -0.31, 10.0, 0.09, 0.58);
  float blueShift = ribbon(p - offset, vec2(-0.08, 0.44), -0.31, 10.0, 0.09, 0.58);
  color += uRose * redShift * 0.22;
  color.r += redShift * 0.24 + lowerHot * 0.18;
  color.g += prism * 0.24;
  color.b += blueShift * 0.64 + pointerGlow * 0.08;

  float centerShade = smoothstep(0.74, 0.08, length(p - vec2(0.08, -0.02)));
  color *= mix(0.48, 1.0, energy + centerShade * 0.54);
  color += pointerGlow * vec3(0.04, 0.08, 0.18);
  color += vec3(0.92, 0.94, 1.0) * pointerLight * 0.42;
  color += pow(max(energy, 0.0), 3.0) * vec3(0.38, 0.46, 0.86);

  float copyShade =
    smoothstep(0.08, 0.22, uv.x) *
    smoothstep(0.79, 0.58, uv.x) *
    smoothstep(0.26, 0.4, uv.y) *
    smoothstep(0.96, 0.72, uv.y);
  color *= mix(1.0, 0.24, copyShade);
  color += uInk * copyShade * 0.28;
  color += vec3(0.95, 0.97, 1.0) * pointerLight * 0.86;

  color += (grain - 0.5) * 0.035;

  float vignette = smoothstep(1.05, 0.25, length((uv - 0.5) * vec2(1.1, 0.92)));
  color *= mix(0.58, 1.15, vignette);
  float opacityGradient =
    smoothstep(0.02, 0.35, energy + pointerGlow * 0.32) *
    smoothstep(1.1, 0.08, length(p - pointer) + 0.24);
  color *= mix(0.62, 1.0, opacityGradient);
  color = pow(max(color, 0.0), vec3(0.96));

  gl_FragColor = vec4(color, 1.0);
}
`;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function IridescentWaveScene({
  active,
  hostRef,
}: {
  active: boolean;
  hostRef: RefObject<HTMLDivElement | null>;
}) {
  const meshRef = useRef<Mesh>(null);
  const pointerRef = useRef(new Vector2(0.58, 0.52));
  const smoothedPointerRef = useRef(new Vector2(0.58, 0.52));
  const activeRef = useRef(0);
  const smoothedActiveRef = useRef(0);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const { size } = useThree();
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
    uPointer: { value: new Vector2(0.58, 0.52) },
    uPointerActive: { value: 0 },
    uInk: { value: new Color("#020308") },
    uCyan: { value: new Color("#5f7dff") },
    uAmber: { value: new Color("#f4b7ff") },
    uRose: { value: new Color("#b790ff") },
  }));

  useEffect(() => {
    materialRef.current?.uniforms.uResolution.value.set(size.width, size.height);
  }, [size.height, size.width]);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const bounds = hostRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const nextX = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      const nextY = 1 - (event.clientY - bounds.top) / Math.max(bounds.height, 1);

      activeRef.current =
        nextX >= 0 && nextX <= 1 && nextY >= 0 && nextY <= 1 ? 1 : 0;

      pointerRef.current.set(
        clamp(nextX, 0, 1),
        clamp(nextY, 0, 1)
      );
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => window.removeEventListener("pointermove", updatePointer);
  }, [hostRef]);

  useFrame(() => {
    if (!active) return;
    const currentMaterial = materialRef.current;
    if (!currentMaterial) return;

    smoothedPointerRef.current.lerp(pointerRef.current, 0.145);
    smoothedActiveRef.current +=
      (activeRef.current - smoothedActiveRef.current) * 0.28;

    currentMaterial.uniforms.uTime.value = performance.now() / 1000;
    currentMaterial.uniforms.uPointer.value.copy(smoothedPointerRef.current);
    currentMaterial.uniforms.uPointerActive.value = smoothedActiveRef.current;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function HeroShader({ className }: HeroShaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
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

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(motionQuery.matches);

    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduceMotion || !loaderComplete) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "160px 0px 160px 0px", threshold: 0.01 }
    );

    observer.observe(wrap);

    return () => observer.disconnect();
  }, [loaderComplete, reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      {loaderComplete && !reduceMotion && (
        <Canvas
          frameloop={active ? "always" : "demand"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 1], fov: 45 }}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.45 }}
        >
          <IridescentWaveScene active={active} hostRef={wrapRef} />
        </Canvas>
      )}
    </div>
  );
}

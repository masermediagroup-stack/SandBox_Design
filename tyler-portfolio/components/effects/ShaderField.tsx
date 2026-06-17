"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  hasCompletedPreloader,
  PRELOADER_COMPLETE_EVENT,
} from "@/lib/preloader-state";

type ShaderFieldProps = {
  className?: string;
};

const shaderGradientPreset = {
  animate: "on",
  axesHelper: "off",
  bgColor1: "#000000",
  bgColor2: "#000000",
  brightness: 2.1,
  cAzimuthAngle: 270,
  cDistance: 0.52,
  cPolarAngle: 180,
  cameraZoom: 28.69,
  color1: "#77D5FC",
  color2: "#FABFFC",
  color3: "#1e1e1e",
  destination: "onCanvas",
  embedMode: "off",
  envPreset: "city",
  format: "gif",
  fov: 60,
  frameRate: 10,
  gizmoHelper: "hide",
  grain: "on",
  lightType: "env",
  pixelDensity: 2.1,
  positionX: -0.1,
  positionY: 0,
  positionZ: 0,
  range: "disabled",
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.3,
  rotationX: 0,
  rotationY: 130,
  rotationZ: 70,
  shader: "defaults",
  type: "sphere",
  uAmplitude: 1.1,
  uDensity: 0.7,
  uFrequency: 5.5,
  uSpeed: 0.2,
  uStrength: 0.5,
  uTime: 0,
  wireframe: false,
} as const;

export function ShaderField({ className }: ShaderFieldProps) {
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

  return (
    <div className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        pixelDensity={2.1}
        fov={60}
      >
        <ShaderGradient {...shaderGradientPreset} />
      </ShaderGradientCanvas>
    </div>
  );
}

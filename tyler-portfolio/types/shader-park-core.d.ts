declare module "shader-park-core/dist/shader-park-core.esm.js" {
  type UniformDescription =
    | { name: string; type: "float"; value: number }
    | { name: string; type: "vec2"; value: { x: number; y: number } }
    | { name: string; type: "vec3"; value: { x: number; y: number; z: number } }
    | {
        name: string;
        type: "vec4";
        value: { x: number; y: number; z: number; w: number };
      };

  export function sculptToThreeJSShaderSource(source: string): {
    uniforms: UniformDescription[];
    vert: string;
    frag: string;
    error?: unknown;
  };
}

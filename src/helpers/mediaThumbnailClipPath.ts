export type MediaThumbnailClipPhase = "default" | "hover";

const fnv1a = (value: string): number => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const polygonClipFromSeed = (
  seed: string,
  phase: MediaThumbnailClipPhase,
): string => {
  const hash = fnv1a(seed);
  const sides = 5 + (hash % 4);
  const points: string[] = [];
  const rotation = phase === "hover" ? 0.14 : 0;
  const radiusScale = phase === "hover" ? 0.9 : 1;

  for (let index = 0; index < sides; index++) {
    const angle = (index / sides) * Math.PI * 2 - Math.PI / 2 + rotation;
    const nudge = ((hash >>> (index * 4)) & 0xf) / 16;
    const radius = (0.82 + nudge * 0.16) * radiusScale;
    const x = 50 + Math.cos(angle) * 50 * radius;
    const y = 50 + Math.sin(angle) * 50 * radius;
    points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${points.join(", ")})`;
};

export const getMediaThumbnailClipPath = (
  seed: string,
  phase: MediaThumbnailClipPhase = "default",
): string => polygonClipFromSeed(seed, phase);

export const getMediaThumbnailClipPaths = (
  seed: string,
): { default: string; hover: string } => ({
  default: polygonClipFromSeed(seed, "default"),
  hover: polygonClipFromSeed(seed, "hover"),
});

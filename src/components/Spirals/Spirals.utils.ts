import { formatHex, oklch, parseHex } from "culori";
import { isBrowser } from "src/helpers/helpers";
import { getLruMapEntry, setLruMapEntry } from "src/helpers/lruMap";
import {
  randomDecFromInterval,
  randomIntFromInterval,
} from "src/utils/helpers";

export type SpiralsThemePreference = "dark" | "light" | "no-preference";

export const SPIRALS_CONSTANTS = {
  VIEWBOX: 1500,
  DEGREES_TO_RADIANS: (1 * Math.PI) / 180,
  OPACITY_SUBTRACTION: 0.075,
  RADIAL_INDEX_FACTOR: 1.35,
};

export const HARMONIC_MINIMUMS = {
  heroSpiralReach: 340,
  heroElementSize: 32,
  heroCircleOffset: 56,
  heroAnimationScale: 1.15,
  heroAnimationScaleMax: 1.72,
  supportAnimationScaleMax: 1.26,
  heroCircleCount: 8,
  heroSpiralSpacing: 0.75,
  minRadialStepToElementRatio: 1.12,
  supportElementSize: 12,
  supportCircleOffset: 40,
  minSpiralSetCount: 3,
  minLayerHueSpread: 52,
} as const;

export const MIN_HERO_SPIRAL_REACH = HARMONIC_MINIMUMS.heroSpiralReach;

const detectLightModeFromDocument = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  return (
    document.body.dataset.theme === "light" ||
    document.documentElement.classList.contains("theme-light") ||
    (!document.body.dataset.theme &&
      !document.documentElement.classList.contains("theme-dark") &&
      window.matchMedia("(prefers-color-scheme: light)").matches)
  );
};

export const isLightSpiralsTheme = (
  theme?: SpiralsThemePreference,
): boolean => {
  if (theme === "light") {
    return true;
  }
  if (theme === "dark") {
    return false;
  }
  return detectLightModeFromDocument();
};

export const resolveLightnessForTheme = (
  lightness: number,
  theme?: SpiralsThemePreference,
): number => {
  if (!isLightSpiralsTheme(theme)) {
    return lightness;
  }
  return Math.max(0.2, Math.min(0.6, lightness * 0.6));
};

export const storeLightnessFromPicker = (
  pickerLightness: number,
  theme?: SpiralsThemePreference,
): number => {
  if (!isLightSpiralsTheme(theme)) {
    return pickerLightness;
  }
  return Math.max(0.3, Math.min(0.76, pickerLightness / 0.6));
};

const shapeCache = new Map<string, string>();

const generateCacheKey = (
  shape: string,
  cx: number,
  cy: number,
  radius: number,
  polygonSides?: number,
) => {
  return `${shape}-${cx.toFixed(2)}-${cy.toFixed(2)}-${radius.toFixed(2)}-${polygonSides || 0}`;
};

export function getPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
): string {
  const cacheKey = generateCacheKey("polygon", cx, cy, radius, sides);

  const cachedPolygon = getLruMapEntry(shapeCache, cacheKey);
  if (cachedPolygon) {
    return cachedPolygon;
  }

  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  const result = points.join(" ");
  setLruMapEntry(shapeCache, cacheKey, result);
  return result;
}

export function getTrianglePoints(
  cx: number,
  cy: number,
  radius: number,
): string {
  const cacheKey = generateCacheKey("triangle", cx, cy, radius);

  const cachedTriangle = getLruMapEntry(shapeCache, cacheKey);
  if (cachedTriangle) {
    return cachedTriangle;
  }

  const points = [
    `${cx},${cy - radius}`,
    `${cx - radius * 0.866},${cy + radius * 0.5}`,
    `${cx + radius * 0.866},${cy + radius * 0.5}`,
  ];

  const result = points.join(" ");
  setLruMapEntry(shapeCache, cacheKey, result);
  return result;
}

const colorConversionCache = new Map<string, string>();

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export const hexToOklch = (hex: string): OklchColor => {
  const cachedOklch = getLruMapEntry(colorConversionCache, hex);
  if (cachedOklch) {
    try {
      const parsed = JSON.parse(cachedOklch);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        typeof parsed.l === "number" &&
        typeof parsed.c === "number" &&
        typeof parsed.h === "number"
      ) {
        return parsed;
      }
    } catch {
      colorConversionCache.delete(hex);
    }
  }

  const color = oklch(parseHex(hex));
  if (!color) {
    return { l: 0.5, c: 0.2, h: 0 };
  }

  const result = {
    l: color.l || 0.5,
    c: color.c || 0.2,
    h: color.h || 0,
  };

  setLruMapEntry(colorConversionCache, hex, JSON.stringify(result));
  return result;
};

export const oklchToHex = (l: number, c: number, h: number): string => {
  const cacheKey = `${l}-${c}-${h}`;

  const cachedHex = getLruMapEntry(colorConversionCache, cacheKey);
  if (cachedHex) {
    return cachedHex;
  }

  const color = oklch({ l, c, h });
  const hex = formatHex(color) || "#000000";

  setLruMapEntry(colorConversionCache, cacheKey, hex);
  return hex;
};

export interface SpiralsConfig {
  id: string;
  animationSpeed: number;
  animationScale: number;
  pulseEnabled: boolean;
  pulseSpeed: number;
  pulseIntensity: number;
  pulseOffset: number;
  shapeSpinEnabled: boolean;
  shapeSpinSpeed: number;
  shapeSpinDirection: 1 | -1;
  shapeSpinAlternate: boolean;
  spiralCount: number;
  circleCount: number;
  circleOffset: number;
  elementSize: number;
  spiralSpacing: number;
  fill: boolean;
  strokeWidth: number;
  opacitySubtraction: number;
  shape: "circle" | "square" | "triangle" | "polygon";
  polygonSides: number;
  lightness: number;
  chroma: number;
  hue: number;
  name?: string;
}

export const DEFAULT_CONFIG: SpiralsConfig = {
  id: "default-spiral-config",
  animationSpeed: 30000,
  animationScale: 1,
  pulseEnabled: true,
  pulseSpeed: 0.8,
  pulseIntensity: 0.25,
  pulseOffset: 0,
  shapeSpinEnabled: true,
  shapeSpinSpeed: 12,
  shapeSpinDirection: 1,
  shapeSpinAlternate: true,
  spiralCount: 6,
  circleCount: 12,
  circleOffset: 60,
  elementSize: 40,
  spiralSpacing: 0.75,
  fill: true,
  strokeWidth: 0,
  opacitySubtraction: 0.08,
  shape: "circle",
  polygonSides: 6,
  lightness: 0.5,
  chroma: 0.2,
  hue: 220,
  name: "Cool Filled",
};

const generateSpiralName = (config: SpiralsConfig): string => {
  const speedWords =
    config.animationSpeed > 25000
      ? ["Slow", "Gentle", "Peaceful"]
      : config.animationSpeed > 15000
        ? ["Steady", "Calm", "Smooth"]
        : ["Fast", "Dynamic", "Energetic"];

  const colorWords =
    config.hue < 60
      ? ["Golden", "Warm", "Sunny"]
      : config.hue < 120
        ? ["Fresh", "Natural", "Organic"]
        : config.hue < 180
          ? ["Cool", "Oceanic", "Tranquil"]
          : config.hue < 240
            ? ["Deep", "Mysterious", "Cosmic"]
            : config.hue < 300
              ? ["Vibrant", "Electric", "Bold"]
              : ["Rich", "Passionate", "Intense"];

  const styleWords = config.fill
    ? ["Filled", "Solid", "Rich"]
    : ["Outline", "Wire", "Skeletal"];

  const densityWords =
    config.spiralCount > 8
      ? ["Dense", "Complex", "Layered"]
      : config.spiralCount > 5
        ? ["Balanced", "Harmonious", "Structured"]
        : ["Sparse", "Minimal", "Open"];

  const sizeWords =
    config.elementSize < 10
      ? ["Tiny", "Micro", "Dotted"]
      : config.elementSize < 25
        ? ["Small", "Delicate", "Fine"]
        : config.elementSize < 45
          ? ["Medium", "Standard", "Classic"]
          : ["Large", "Bold", "Prominent"];

  const speedWord = speedWords[Math.floor(Math.random() * speedWords.length)];
  const colorWord = colorWords[Math.floor(Math.random() * colorWords.length)];
  const styleWord = styleWords[Math.floor(Math.random() * styleWords.length)];
  const densityWord =
    densityWords[Math.floor(Math.random() * densityWords.length)];
  const sizeWord = sizeWords[Math.floor(Math.random() * sizeWords.length)];

  const patterns = [
    `${colorWord} ${styleWord}`,
    `${speedWord} ${densityWord}`,
    `${colorWord} ${densityWord}`,
    `${speedWord} ${styleWord}`,
    `${densityWord} ${colorWord}`,
    `${styleWord} ${speedWord}`,
    `${sizeWord} ${colorWord}`,
    `${colorWord} ${sizeWord}`,
    `${sizeWord} ${styleWord}`,
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
};

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ANGLE = 137.508;

export const HARMONIC_SPIRAL_COUNTS = [3, 4, 6, 8, 12] as const;
const FIBONACCI_CIRCLE_COUNTS = [5, 8, 13, 21] as const;
const SACRED_POLYGON_SIDES = [3, 4, 6, 8, 12] as const;
const HARMONIC_SPIRAL_SPACINGS = [0.5, 0.618, 0.75] as const;
const HERO_SPIRAL_SPACINGS = [0.75, 0.88, 1] as const;

export const estimateSpiralReach = (config: SpiralsConfig): number => {
  if (config.circleCount <= 0) {
    return 0;
  }

  const lastIndex = config.circleCount - 1;
  const armReach =
    config.circleOffset *
    config.circleCount *
    SPIRALS_CONSTANTS.RADIAL_INDEX_FACTOR *
    config.spiralSpacing;
  const shapeReach = config.elementSize + lastIndex;

  return (armReach + shapeReach) * config.animationScale;
};

const enforceHeroReachMinimums = (config: SpiralsConfig): SpiralsConfig => {
  const next = { ...config };

  next.elementSize = Math.max(
    next.elementSize,
    HARMONIC_MINIMUMS.heroElementSize,
  );
  next.circleOffset = Math.max(
    next.circleOffset,
    HARMONIC_MINIMUMS.heroCircleOffset,
  );
  next.animationScale = Math.max(
    next.animationScale,
    HARMONIC_MINIMUMS.heroAnimationScale,
  );
  next.circleCount = Math.max(
    next.circleCount,
    HARMONIC_MINIMUMS.heroCircleCount,
  );

  if (next.spiralSpacing < HARMONIC_MINIMUMS.heroSpiralSpacing) {
    next.spiralSpacing = HARMONIC_MINIMUMS.heroSpiralSpacing;
  }

  const minRadialStep =
    next.elementSize * HARMONIC_MINIMUMS.minRadialStepToElementRatio;
  let radialStep = next.circleOffset * next.spiralSpacing;
  if (radialStep < minRadialStep) {
    next.circleOffset = Math.ceil(minRadialStep / next.spiralSpacing);
  }

  let guard = 0;
  while (
    estimateSpiralReach(next) < HARMONIC_MINIMUMS.heroSpiralReach &&
    guard < 24 &&
    (next.circleOffset < 112 || next.elementSize < 76)
  ) {
    if (next.circleOffset < 112) {
      next.circleOffset += 4;
    }
    if (next.elementSize < 76) {
      next.elementSize += 2;
    }
    radialStep = next.circleOffset * next.spiralSpacing;
    if (radialStep < minRadialStep) {
      next.circleOffset = Math.ceil(minRadialStep / next.spiralSpacing);
    }
    guard += 1;
  }

  return next;
};

const clampHarmonicConfig = (
  config: SpiralsConfig,
  isHero: boolean,
): SpiralsConfig => {
  if (isHero) {
    const clamped = enforceHeroReachMinimums(config);
    return {
      ...clamped,
      animationScale: clampAnimationScale(clamped.animationScale, true),
    };
  }

  return {
    ...config,
    elementSize: Math.max(
      config.elementSize,
      HARMONIC_MINIMUMS.supportElementSize,
    ),
    circleOffset: Math.max(
      config.circleOffset,
      HARMONIC_MINIMUMS.supportCircleOffset,
    ),
    animationScale: clampAnimationScale(config.animationScale, false),
  };
};

type HarmonicSymmetryTier = "sparse" | "balanced" | "dense";
type HarmonicShapeFamily = "orb" | "hex" | "angular" | "mixed";
type HarmonicColorMode = "analogous" | "golden" | "triadic" | "split";
type HarmonicScaleMood = "intimate" | "classic" | "monumental";

interface HarmonicComposition {
  baseHue: number;
  chroma: number;
  shapeFamily: HarmonicShapeFamily;
  symmetryTier: HarmonicSymmetryTier;
  scaleMood: HarmonicScaleMood;
  layerCount: number;
  pulseLayerIndex: number;
  colorMode: HarmonicColorMode;
  speedBaseMs: number;
  sharedSpiralCount: number;
  heroAnimationScale: number;
  heroElementSize: number;
  heroCircleOffset: number;
}

const LAYER_ANIMATION_SCALE_FACTORS = [
  1,
  1 / 1.22,
  1 / 1.22 / 1.18,
  1 / PHI,
] as const;

const animationScaleStepForMood = (mood: HarmonicScaleMood): number => {
  switch (mood) {
    case "monumental":
      return 0.13;
    case "classic":
      return 0.095;
    case "intimate":
      return 0.055;
  }
};

const elementSizeStepForMood = (mood: HarmonicScaleMood): number => {
  switch (mood) {
    case "monumental":
      return 9;
    case "classic":
      return 7;
    case "intimate":
      return 5;
  }
};

const circleOffsetStepForMood = (mood: HarmonicScaleMood): number => {
  switch (mood) {
    case "monumental":
      return 6;
    case "classic":
      return 5;
    case "intimate":
      return 4;
  }
};

const animationScaleForLayer = (
  composition: HarmonicComposition,
  layerIndex: number,
): number => {
  const isHero = layerIndex === 0;
  if (isHero) {
    return clampAnimationScale(composition.heroAnimationScale, true);
  }

  const factor =
    LAYER_ANIMATION_SCALE_FACTORS[layerIndex] ??
    LAYER_ANIMATION_SCALE_FACTORS[LAYER_ANIMATION_SCALE_FACTORS.length - 1];
  const factored = composition.heroAnimationScale * factor;
  const stepped =
    composition.heroAnimationScale -
    layerIndex * animationScaleStepForMood(composition.scaleMood);
  const blended = factored * 0.45 + stepped * 0.55;

  return clampAnimationScale(blended, false);
};

const elementSizeForLayer = (
  composition: HarmonicComposition,
  layerIndex: number,
): number => {
  if (layerIndex === 0) {
    return composition.heroElementSize;
  }

  const [supportMin, supportMax] = elementSizeRangeForMood(
    composition.scaleMood,
    false,
  );
  const stepped =
    composition.heroElementSize -
    layerIndex * elementSizeStepForMood(composition.scaleMood);
  const ratio = Math.max(0.42, 1 - layerIndex * 0.16);
  const factored = Math.round(composition.heroElementSize * ratio);
  const target = Math.round(factored * 0.5 + stepped * 0.5);

  return Math.max(supportMin, Math.min(supportMax, target));
};

const circleOffsetForLayer = (
  composition: HarmonicComposition,
  layerIndex: number,
): number => {
  if (layerIndex === 0) {
    return composition.heroCircleOffset;
  }

  const [offsetMin, offsetMax] = circleOffsetRangeForMood(
    composition.scaleMood,
  );
  const stepped =
    composition.heroCircleOffset -
    layerIndex * circleOffsetStepForMood(composition.scaleMood);

  return Math.max(offsetMin, Math.min(offsetMax, stepped));
};

const pickHarmonic = <T>(items: readonly T[]): T => {
  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? items[0];
};

const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const pairwiseHueSpread = (a: number, b: number) => {
  const left = normalizeHue(a);
  const right = normalizeHue(b);
  return Math.min(Math.abs(left - right), 360 - Math.abs(left - right));
};

const hueSpreadBounds = (hues: number[]): { min: number; max: number } => {
  if (hues.length < 2) {
    return { min: 360, max: 0 };
  }

  let minSpread = 360;
  let maxSpread = 0;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const spread = pairwiseHueSpread(hues[i] ?? 0, hues[j] ?? 0);
      minSpread = Math.min(minSpread, spread);
      maxSpread = Math.max(maxSpread, spread);
    }
  }

  return { min: minSpread, max: maxSpread };
};

const pickColorMode = (): HarmonicColorMode =>
  pickHarmonic<HarmonicColorMode>([
    "triadic",
    "triadic",
    "split",
    "split",
    "golden",
    "analogous",
  ]);

const spiralCountForTier = (tier: HarmonicSymmetryTier): number => {
  switch (tier) {
    case "sparse":
      return pickHarmonic([3, 4] as const);
    case "balanced":
      return 6;
    case "dense":
      return pickHarmonic([8, 12] as const);
  }
};

const circleCountForTier = (
  tier: HarmonicSymmetryTier,
  scaleMood: HarmonicScaleMood,
): number => {
  const options =
    tier === "dense"
      ? scaleMood === "monumental"
        ? ([8, 13] as const)
        : FIBONACCI_CIRCLE_COUNTS
      : tier === "balanced"
        ? scaleMood === "monumental"
          ? ([5, 8] as const)
          : ([5, 8, 13] as const)
        : ([5, 8] as const);
  return pickHarmonic(options);
};

const pickScaleMood = (): HarmonicScaleMood => {
  const roll = Math.random();
  if (roll < 0.4) {
    return "intimate";
  }
  if (roll < 0.75) {
    return "classic";
  }
  return "monumental";
};

const scaleMoodFromElementSize = (elementSize: number): HarmonicScaleMood => {
  if (elementSize > 65) {
    return "monumental";
  }
  if (elementSize > 40) {
    return "classic";
  }
  return "intimate";
};

const elementSizeRangeForMood = (
  mood: HarmonicScaleMood,
  isHero: boolean,
): [number, number] => {
  if (isHero) {
    switch (mood) {
      case "monumental":
        return [50, 78];
      case "classic":
        return [28, 65];
      case "intimate":
        return [30, 40];
    }
  }
  switch (mood) {
    case "monumental":
      return [18, 48];
    case "classic":
      return [10, 40];
    case "intimate":
      return [12, 22];
  }
};

const circleOffsetRangeForMood = (
  mood: HarmonicScaleMood,
): [number, number] => {
  switch (mood) {
    case "monumental":
      return [62, 98];
    case "classic":
      return [52, 82];
    case "intimate":
      return [48, 72];
  }
};

const animationScaleRangeForMood = (
  mood: HarmonicScaleMood,
  isHero: boolean,
): [number, number] => {
  if (isHero) {
    switch (mood) {
      case "monumental":
        return [1.22, 1.72];
      case "classic":
        return [1.1, 1.45];
      case "intimate":
        return [1.12, 1.26];
    }
  }
  switch (mood) {
    case "monumental":
      return [1.05, 1.26];
    case "classic":
      return [1.03, 1.2];
    case "intimate":
      return [1.02, 1.12];
  }
};

const clampAnimationScale = (scale: number, isHero: boolean): number => {
  const max = isHero
    ? HARMONIC_MINIMUMS.heroAnimationScaleMax
    : HARMONIC_MINIMUMS.supportAnimationScaleMax;
  const min = isHero ? HARMONIC_MINIMUMS.heroAnimationScale : 1;
  return Math.max(min, Math.min(max, scale));
};

const POLYGON_SIDE_VARIATIONS = [3, 4, 5, 6, 8, 10, 12] as const;

const pickRandomShapeVariant = (): Pick<
  SpiralsConfig,
  "shape" | "polygonSides"
> => {
  const roll = Math.random();
  if (roll < 0.22) {
    return { shape: "circle", polygonSides: 6 };
  }
  if (roll < 0.38) {
    return { shape: "square", polygonSides: 4 };
  }
  if (roll < 0.52) {
    return { shape: "triangle", polygonSides: 3 };
  }
  return {
    shape: "polygon",
    polygonSides: pickHarmonic(POLYGON_SIDE_VARIATIONS),
  };
};

const pickShapeForFamily = (
  family: HarmonicShapeFamily,
): Pick<SpiralsConfig, "shape" | "polygonSides"> => {
  if (family === "mixed") {
    return pickRandomShapeVariant();
  }

  switch (family) {
    case "orb": {
      if (Math.random() < 0.4) {
        return { shape: "circle", polygonSides: 6 };
      }
      return {
        shape: "polygon",
        polygonSides: pickHarmonic([5, 6, 8, 12] as const),
      };
    }
    case "hex": {
      const roll = Math.random();
      if (roll < 0.25) {
        return { shape: "circle", polygonSides: 6 };
      }
      if (roll < 0.45) {
        return { shape: "square", polygonSides: 4 };
      }
      return {
        shape: "polygon",
        polygonSides: pickHarmonic([5, 6, 8, 10, 12] as const),
      };
    }
    case "angular": {
      const roll = Math.random();
      if (roll < 0.3) {
        return { shape: "triangle", polygonSides: 3 };
      }
      if (roll < 0.55) {
        return { shape: "square", polygonSides: 4 };
      }
      if (roll < 0.75) {
        return { shape: "circle", polygonSides: 6 };
      }
      return {
        shape: "polygon",
        polygonSides: pickHarmonic(SACRED_POLYGON_SIDES),
      };
    }
  }
};

const pickShapeForLayer = (
  family: HarmonicShapeFamily,
  layerIndex: number,
): Pick<SpiralsConfig, "shape" | "polygonSides"> => {
  if (family === "mixed") {
    return pickRandomShapeVariant();
  }

  const layerVariationChance = layerIndex === 0 ? 0.28 : 0.42;
  if (Math.random() < layerVariationChance) {
    return pickRandomShapeVariant();
  }

  return pickShapeForFamily(family);
};

const hueForLayer = (
  composition: HarmonicComposition,
  layerIndex: number,
): number => {
  const { colorMode, baseHue, layerCount } = composition;
  let offset = 0;

  switch (colorMode) {
    case "triadic":
      offset = (layerIndex % 3) * 120 + Math.floor(layerIndex / 3) * 28;
      break;
    case "split":
      offset = [0, 78, 158, 228][layerIndex % 4] ?? 0;
      break;
    case "golden":
      offset = layerIndex * GOLDEN_ANGLE;
      break;
    case "analogous":
      if (layerCount <= 1) {
        offset = 0;
      } else {
        offset = (layerIndex * 96) / (layerCount - 1);
      }
      break;
  }

  return normalizeHue(baseHue + offset);
};

const chromaForLayer = (baseChroma: number, layerIndex: number): number => {
  const deltas = [0.045, -0.035, 0.065, -0.05, 0.025];
  const delta = deltas[layerIndex % deltas.length] ?? 0;
  return Math.max(0.11, Math.min(0.27, baseChroma + delta));
};

const lightnessForLayer = (
  baseLightness: number,
  layerIndex: number,
  useOutline: boolean,
): number => {
  let lightness = baseLightness;
  if (useOutline) {
    lightness += 0.055;
  }
  if (layerIndex === 0) {
    lightness += 0.035;
  } else {
    lightness -= 0.04 * layerIndex;
  }
  return Math.max(0.3, Math.min(0.76, lightness));
};

const opacitySubtractionForDensity = (
  spiralCount: number,
  circleCount: number,
): number => {
  const density = spiralCount * circleCount;
  if (density > 120) {
    return randomDecFromInterval(0.06, 0.09);
  }
  if (density > 70) {
    return randomDecFromInterval(0.05, 0.075);
  }
  return randomDecFromInterval(0.035, 0.06);
};

const pickHarmonicComposition = (layerCount: number): HarmonicComposition => {
  const scaleMood = pickScaleMood();
  let symmetryTier = pickHarmonic<HarmonicSymmetryTier>([
    "sparse",
    "balanced",
    "dense",
  ]);
  if (scaleMood === "monumental" && symmetryTier === "dense") {
    symmetryTier = Math.random() < 0.75 ? "balanced" : "sparse";
  }
  if (scaleMood === "intimate" && symmetryTier === "sparse") {
    symmetryTier = Math.random() < 0.5 ? "balanced" : symmetryTier;
  }
  const shapeFamily = pickHarmonic<HarmonicShapeFamily>([
    "mixed",
    "mixed",
    "angular",
    "hex",
    "orb",
  ]);
  const sharedSpiralCount = spiralCountForTier(symmetryTier);
  const wantsPulse = Math.random() < 0.45;
  const pulseLayerIndex = wantsPulse
    ? Math.floor(Math.random() * layerCount)
    : -1;

  const [heroScaleMin, heroScaleMax] = animationScaleRangeForMood(
    scaleMood,
    true,
  );
  const [heroSizeMin, heroSizeMax] = elementSizeRangeForMood(scaleMood, true);
  const [offsetMin, offsetMax] = circleOffsetRangeForMood(scaleMood);

  return {
    baseHue: Math.floor(Math.random() * 360),
    chroma: randomDecFromInterval(0.12, 0.22),
    shapeFamily,
    symmetryTier,
    scaleMood,
    layerCount,
    pulseLayerIndex,
    colorMode: pickColorMode(),
    speedBaseMs: randomIntFromInterval(18000, 32000),
    sharedSpiralCount,
    heroAnimationScale: randomDecFromInterval(heroScaleMin, heroScaleMax),
    heroElementSize: randomIntFromInterval(heroSizeMin, heroSizeMax),
    heroCircleOffset: randomIntFromInterval(offsetMin, offsetMax),
  };
};

const deriveCompositionFromConfigs = (
  configs: SpiralsConfig[],
): HarmonicComposition => {
  const primary = configs[0];
  if (!primary) {
    return pickHarmonicComposition(1);
  }

  const symmetryTier: HarmonicSymmetryTier =
    primary.spiralCount >= 8
      ? "dense"
      : primary.spiralCount >= 6
        ? "balanced"
        : "sparse";

  const shapeKinds = new Set(configs.map((config) => config.shape));
  let shapeFamily: HarmonicShapeFamily = shapeKinds.size > 1 ? "mixed" : "orb";
  if (shapeKinds.size === 1) {
    if (primary.shape === "triangle" || primary.shape === "square") {
      shapeFamily = "angular";
    } else if (primary.shape === "polygon") {
      shapeFamily = "hex";
    }
  }

  const pulseLayerIndex = configs.some((config) => config.pulseEnabled)
    ? -1
    : Math.random() < 0.35
      ? configs.length
      : -1;

  return {
    baseHue: primary.hue,
    chroma: primary.chroma,
    shapeFamily,
    symmetryTier,
    scaleMood: scaleMoodFromElementSize(primary.elementSize),
    layerCount: configs.length + 1,
    pulseLayerIndex,
    colorMode:
      hueSpreadBounds(configs.map((config) => config.hue)).max > 90
        ? "golden"
        : "analogous",
    speedBaseMs: primary.animationSpeed,
    sharedSpiralCount: primary.spiralCount,
    heroAnimationScale: primary.animationScale,
    heroElementSize: primary.elementSize,
    heroCircleOffset: primary.circleOffset,
  };
};

const generateHarmonicLayer = (
  composition: HarmonicComposition,
  layerIndex: number,
): SpiralsConfig => {
  const isHero = layerIndex === 0;
  const { shape, polygonSides } = pickShapeForLayer(
    composition.shapeFamily,
    layerIndex,
  );
  let circleCount = circleCountForTier(
    composition.symmetryTier,
    composition.scaleMood,
  );
  if (isHero) {
    circleCount = Math.max(circleCount, HARMONIC_MINIMUMS.heroCircleCount);
  }
  const baseLightness = randomDecFromInterval(0.48, 0.72);
  const speedRatio = isHero ? 1 : layerIndex === 1 ? 1 / 1.5 : 1 / PHI;
  const useOutline =
    !isHero &&
    (composition.scaleMood === "monumental"
      ? Math.random() < 0.35
      : Math.random() < 0.55);
  const config: SpiralsConfig = {
    id: crypto.randomUUID(),
    animationSpeed: Math.floor(composition.speedBaseMs * speedRatio),
    animationScale: animationScaleForLayer(composition, layerIndex),
    pulseEnabled: layerIndex === composition.pulseLayerIndex,
    pulseSpeed: randomDecFromInterval(0.6, 1.4),
    pulseIntensity: randomDecFromInterval(0.12, 0.28),
    pulseOffset: randomDecFromInterval(0, Math.PI * 2),
    shapeSpinEnabled: Math.random() < 0.85,
    shapeSpinSpeed: randomDecFromInterval(5, 22),
    shapeSpinDirection: Math.random() < 0.5 ? -1 : 1,
    shapeSpinAlternate: Math.random() < 0.55,
    spiralCount: composition.sharedSpiralCount,
    circleCount,
    circleOffset: circleOffsetForLayer(composition, layerIndex),
    elementSize: elementSizeForLayer(composition, layerIndex),
    fill: !useOutline,
    strokeWidth: useOutline ? randomDecFromInterval(1, 3.5) : 0,
    opacitySubtraction: opacitySubtractionForDensity(
      composition.sharedSpiralCount,
      circleCount,
    ),
    lightness: lightnessForLayer(baseLightness, layerIndex, useOutline),
    chroma: chromaForLayer(composition.chroma, layerIndex),
    hue: hueForLayer(composition, layerIndex),
    shape,
    polygonSides,
    spiralSpacing: isHero
      ? pickHarmonic(HERO_SPIRAL_SPACINGS)
      : pickHarmonic(HARMONIC_SPIRAL_SPACINGS),
  };

  config.name = generateSpiralName(config);
  return clampHarmonicConfig(config, isHero);
};

export const scoreHarmonicConfigSet = (configs: SpiralsConfig[]): number => {
  if (configs.length === 0) {
    return 0;
  }

  let score = 100;
  const totalShapes = configs.reduce(
    (sum, config) => sum + config.spiralCount * config.circleCount,
    0,
  );

  if (totalShapes > 900) {
    return 0;
  }
  if (totalShapes > 650) {
    score -= (totalShapes - 650) / 8;
  }

  const pulseLayers = configs.filter((config) => config.pulseEnabled).length;
  if (pulseLayers > 1) {
    score -= 45;
  } else if (pulseLayers === 1 && totalShapes > 420) {
    score -= 30;
  }

  const hues = configs.map((config) => config.hue);
  const { min: tightestPair, max: spread } = hueSpreadBounds(hues);
  if (spread > 165) {
    score -= 35;
  } else if (spread > 130) {
    score -= 15;
  }

  if (configs.length >= HARMONIC_MINIMUMS.minSpiralSetCount) {
    if (tightestPair < HARMONIC_MINIMUMS.minLayerHueSpread) {
      score -= 40;
    }
    if (tightestPair < 38) {
      return 0;
    }
  }

  const heavyOutlineLayers = configs.filter(
    (config) => !config.fill && config.strokeWidth >= 3,
  ).length;
  if (heavyOutlineLayers > 1) {
    score -= 25;
  }

  const chromaValues = configs.map((config) => config.chroma);
  const chromaSpread = Math.max(...chromaValues) - Math.min(...chromaValues);
  if (chromaSpread > 0.12) {
    score -= 20;
  }

  for (const config of configs) {
    if (
      !(HARMONIC_SPIRAL_COUNTS as readonly number[]).includes(
        config.spiralCount,
      )
    ) {
      score -= 12;
    }
    if (
      !(FIBONACCI_CIRCLE_COUNTS as readonly number[]).includes(
        config.circleCount,
      )
    ) {
      score -= 8;
    }
  }

  const spiralCounts = new Set(configs.map((config) => config.spiralCount));
  if (spiralCounts.size > 2) {
    score -= 10;
  }

  for (let i = 0; i < configs.length - 1; i++) {
    const outer = configs[i]?.animationScale ?? 0;
    const inner = configs[i + 1]?.animationScale ?? 0;
    if (outer <= inner) {
      score -= 35;
    } else if (outer - inner < 0.045) {
      score -= 18;
    }
  }

  const maxReach = Math.max(...configs.map(estimateSpiralReach));
  if (maxReach < HARMONIC_MINIMUMS.heroSpiralReach) {
    return 0;
  }

  return Math.max(0, score);
};

export const harmonicConfigSetPassesQualityGate = (
  configs: SpiralsConfig[],
): boolean => scoreHarmonicConfigSet(configs) >= 62;

const buildHarmonicConfigSet = (layerCount: number): SpiralsConfig[] => {
  const composition = pickHarmonicComposition(layerCount);
  return Array.from({ length: layerCount }, (_, layerIndex) =>
    generateHarmonicLayer(composition, layerIndex),
  );
};

export const generateRandomConfig = (
  existingConfigs?: SpiralsConfig[],
): SpiralsConfig => {
  if (existingConfigs && existingConfigs.length > 0) {
    const composition = deriveCompositionFromConfigs(existingConfigs);
    return generateHarmonicLayer(composition, existingConfigs.length);
  }

  const composition = pickHarmonicComposition(1);
  return generateHarmonicLayer(composition, 0);
};

export const createRandomConfigSet = (): SpiralsConfig[] => {
  const maxAttempts = 48;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const layerCount =
      HARMONIC_MINIMUMS.minSpiralSetCount + Math.floor(Math.random() * 2);
    const configs = buildHarmonicConfigSet(layerCount);
    if (harmonicConfigSetPassesQualityGate(configs)) {
      return configs;
    }
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const configs = buildHarmonicConfigSet(HARMONIC_MINIMUMS.minSpiralSetCount);
    if (harmonicConfigSetPassesQualityGate(configs)) {
      return configs;
    }
  }

  return buildHarmonicConfigSet(HARMONIC_MINIMUMS.minSpiralSetCount);
};

export const sortConfigsForPaintOrder = (
  configs: SpiralsConfig[],
): SpiralsConfig[] => {
  return configs.slice().sort((a, b) => {
    if (b.animationScale !== a.animationScale) {
      return b.animationScale - a.animationScale;
    }

    return estimateSpiralReach(b) - estimateSpiralReach(a);
  });
};

export function generateSpiralFileName(configs: { name?: string }[]): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const names = configs.map((c) => c.name || "spiral").join("-");
  return `spirals-${names}-${timestamp}.svg`;
}

import { formatHex, oklch, parseHex } from "culori";

export const SPIRALS_CONSTANTS = {
  VIEWBOX: 1500,
  DEGREES_TO_RADIANS: (1 * Math.PI) / 180,
  OPACITY_SUBTRACTION: 0.075,
};

export const adjustLightnessForTheme = (lightness: number): number => {
  if (typeof document !== "undefined") {
    const isLightMode =
      document.body.dataset.theme === "light" ||
      document.documentElement.classList.contains("theme-light") ||
      (!document.body.dataset.theme &&
        !document.documentElement.classList.contains("theme-dark") &&
        window.matchMedia("(prefers-color-scheme: light)").matches);

    if (isLightMode) {
      return Math.max(0.2, Math.min(0.6, lightness * 0.6));
    }
  }

  return lightness;
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

  if (shapeCache.has(cacheKey)) {
    const cached = shapeCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  const result = points.join(" ");
  shapeCache.set(cacheKey, result);
  return result;
}

export function getTrianglePoints(
  cx: number,
  cy: number,
  radius: number,
): string {
  const cacheKey = generateCacheKey("triangle", cx, cy, radius);

  if (shapeCache.has(cacheKey)) {
    const cached = shapeCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const points = [
    `${cx},${cy - radius}`,
    `${cx - radius * 0.866},${cy + radius * 0.5}`,
    `${cx + radius * 0.866},${cy + radius * 0.5}`,
  ];

  const result = points.join(" ");
  shapeCache.set(cacheKey, result);
  return result;
}

export const clearShapeCache = () => {
  shapeCache.clear();
};

const colorConversionCache = new Map<string, string>();

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export const hexToOklch = (hex: string): OklchColor => {
  if (colorConversionCache.has(hex)) {
    const cached = colorConversionCache.get(hex);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
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
        // ignore
      }
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

  colorConversionCache.set(hex, JSON.stringify(result));
  return result;
};

export const oklchToHex = (l: number, c: number, h: number): string => {
  const cacheKey = `${l}-${c}-${h}`;

  if (colorConversionCache.has(cacheKey)) {
    const cached = colorConversionCache.get(cacheKey);
    if (typeof cached === "string") {
      return cached;
    }
  }

  const color = oklch({ l, c, h });
  const hex = formatHex(color) || "#000000";

  colorConversionCache.set(cacheKey, hex);
  return hex;
};

export const clearColorCache = () => {
  colorConversionCache.clear();
};

const generateUUID = (): string => {
  return crypto.randomUUID();
};

export interface SpiralsConfig {
  id: string;
  animationSpeed: number;
  animationScale: number;
  pulseEnabled: boolean;
  pulseSpeed: number;
  pulseIntensity: number;
  pulseOffset: number;
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
  id: generateUUID(),
  animationSpeed: 30000,
  animationScale: 1,
  pulseEnabled: true,
  pulseSpeed: 0.8,
  pulseIntensity: 0.25,
  pulseOffset: 0,
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
  lightness: adjustLightnessForTheme(0.5),
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

export const generateRandomConfig = (): SpiralsConfig => {
  const shapes: Array<"circle" | "square" | "triangle" | "polygon"> = [
    "circle",
    "square",
    "triangle",
    "polygon",
  ];

  const baseLightness = Math.random() * 0.4 + 0.5;
  const adjustedLightness = adjustLightnessForTheme(baseLightness);

  const pulseEnabled = Math.random() > 0.2;
  const maxSpiralCount = pulseEnabled ? 6 : 10;
  const maxCircleCount = pulseEnabled ? 20 : 30;

  const config: SpiralsConfig = {
    animationSpeed: Math.floor(Math.random() * 20000) + 15000,
    animationScale: Math.random() * 0.9 + 1.1,
    pulseEnabled,
    pulseSpeed: Math.random() * 1.5 + 0.5,
    pulseIntensity: Math.random() * 0.35 + 0.1,
    pulseOffset: Math.random() * Math.PI * 2,
    spiralCount: Math.floor(Math.random() * (maxSpiralCount - 2)) + 3,
    circleCount: Math.floor(Math.random() * (maxCircleCount - 4)) + 5,
    circleOffset: Math.floor(Math.random() * 80) + 30,
    elementSize: Math.floor(Math.random() * 78) + 2,
    fill: Math.random() > 0.5,
    strokeWidth: Math.random() * 6,
    opacitySubtraction: Math.random() * 0.08 + 0.04,
    lightness: adjustedLightness,
    chroma: Math.random() * 0.2 + 0.15,
    hue: Math.floor(Math.random() * 360),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    polygonSides: Math.floor(Math.random() * 5) + 3,
    spiralSpacing: Math.random() * 0.75 + 0.25,
    id: generateUUID(),
  };

  config.name = generateSpiralName(config);
  return config;
};

export const adjustConfigsForTheme = (
  configs: SpiralsConfig[],
): SpiralsConfig[] => {
  return configs.map((config) => ({
    ...config,
    id: generateUUID(),
    lightness: adjustLightnessForTheme(config.lightness),
  }));
};

export function generateSpiralFileName(configs: { name?: string }[]): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const names = configs.map((c) => c.name || "spiral").join("-");
  return `spirals-${names}-${timestamp}.svg`;
}

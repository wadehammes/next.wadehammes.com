import { formatHex, oklch, parseHex } from "culori";

export const SPIRALS_CONSTANTS = {
  VIEWBOX: 1500,
  DEGREES_TO_RADIANS: (1 * Math.PI) / 180,
  OPACITY_SUBTRACTION: 0.075,
};

// Helper function to adjust lightness based on theme
export const adjustLightnessForTheme = (lightness: number): number => {
  // Check if we're in light mode by looking at the body data attribute and html classes
  if (typeof document !== "undefined") {
    const isLightMode =
      document.body.dataset.theme === "light" ||
      document.documentElement.classList.contains("theme-light") ||
      (!document.body.dataset.theme &&
        !document.documentElement.classList.contains("theme-dark") &&
        window.matchMedia("(prefers-color-scheme: light)").matches);

    if (isLightMode) {
      // For light mode, use darker colors (0.2-0.6 range)
      return Math.max(0.2, Math.min(0.6, lightness * 0.6));
    }
  }

  // For dark mode, keep the original lightness
  return lightness;
};

// Performance optimization: Cache for shape calculations
const shapeCache = new Map<string, string>();

// Cache key generator for shape calculations
const generateCacheKey = (
  shape: string,
  cx: number,
  cy: number,
  radius: number,
  polygonSides?: number,
) => {
  return `${shape}-${cx.toFixed(2)}-${cy.toFixed(2)}-${radius.toFixed(2)}-${polygonSides || 0}`;
};

// Utility: Generate points for a regular polygon
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

// Utility: Generate points for an equilateral triangle
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

// Clear shape cache when needed (e.g., on window resize)
export const clearShapeCache = () => {
  shapeCache.clear();
};

// Performance optimization: Batch color conversions
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

// Clear color cache when needed
export const clearColorCache = () => {
  colorConversionCache.clear();
};

// Helper function to generate a UUID using crypto.randomUUID
const generateUUID = (): string => {
  return crypto.randomUUID();
};

export interface SpiralsConfig {
  // Unique identifier
  id: string;

  // Animation
  animationSpeed: number;
  animationScale: number;

  // Pulse Effects
  pulseEnabled: boolean;
  pulseSpeed: number; // Duration in seconds
  pulseIntensity: number; // Scale factor (0.1-0.5)
  pulseOffset: number; // Phase offset in radians (0-2π)

  // Spiral Structure
  spiralCount: number;
  circleCount: number;
  circleOffset: number;
  elementSize: number;
  spiralSpacing: number; // Distance multiplier for spiral expansion (0.25-1)

  // Visual Style
  fill: boolean;
  strokeWidth: number;
  opacitySubtraction: number;
  shape: "circle" | "square" | "triangle" | "polygon";
  polygonSides: number; // For polygon shape

  // Colors
  lightness: number; // OKLCH Lightness (0-1)
  chroma: number; // OKLCH Chroma (0-0.4 typically)
  hue: number; // OKLCH Hue (0-360)

  // Metadata
  name?: string;
}

export const DEFAULT_CONFIG: SpiralsConfig = {
  // Unique identifier
  id: generateUUID(),

  // Animation
  animationSpeed: 30000,
  animationScale: 1,

  // Pulse Effects
  pulseEnabled: true,
  pulseSpeed: 0.8,
  pulseIntensity: 0.25,
  pulseOffset: 0,

  // Spiral Structure
  spiralCount: 6,
  circleCount: 12,
  circleOffset: 60,
  elementSize: 40,
  spiralSpacing: 0.75,

  // Visual Style
  fill: true,
  strokeWidth: 0,
  opacitySubtraction: 0.08,
  shape: "circle",
  polygonSides: 6,

  // Colors
  lightness: adjustLightnessForTheme(0.5),
  chroma: 0.2,
  hue: 220,

  // Metadata
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

  // Generate base lightness and adjust for theme
  const baseLightness = Math.random() * 0.4 + 0.5; // 0.5–0.9 (original range)

  const adjustedLightness = adjustLightnessForTheme(baseLightness);

  // Performance optimization: Reduce complexity when pulse is enabled
  const pulseEnabled = Math.random() > 0.2; // 80% chance of being enabled (increased from 60%)
  const maxSpiralCount = pulseEnabled ? 6 : 10; // Fewer spirals when pulsing
  const maxCircleCount = pulseEnabled ? 20 : 30; // Fewer shapes when pulsing

  const config: SpiralsConfig = {
    animationSpeed: Math.floor(Math.random() * 20000) + 15000, // 15-35 seconds
    animationScale: Math.random() * 0.9 + 1.1, // 1.1-2.0

    // Pulse Effects - More noticeable and frequent
    pulseEnabled,
    pulseSpeed: Math.random() * 1.5 + 0.5, // 0.5-2.0 seconds (faster for more impact)
    pulseIntensity: Math.random() * 0.35 + 0.1, // 0.1-0.45 scale factor (increased intensity)
    pulseOffset: Math.random() * Math.PI * 2, // 0-2π radians

    spiralCount: Math.floor(Math.random() * (maxSpiralCount - 2)) + 3, // 3-maxSpiralCount
    circleCount: Math.floor(Math.random() * (maxCircleCount - 4)) + 5, // 5-maxCircleCount
    circleOffset: Math.floor(Math.random() * 80) + 30, // 30-110
    elementSize: Math.floor(Math.random() * 78) + 2, // 2-80 (tiny dots to large circles)
    fill: Math.random() > 0.5,
    strokeWidth: Math.random() * 6, // 0-6
    opacitySubtraction: Math.random() * 0.08 + 0.04, // 0.04-0.12
    lightness: adjustedLightness,
    chroma: Math.random() * 0.2 + 0.15, // 0.15–0.35 (more vibrant)
    hue: Math.floor(Math.random() * 360),
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    polygonSides: Math.floor(Math.random() * 5) + 3, // 3-7
    spiralSpacing: Math.random() * 0.75 + 0.25, // 0.25-1

    // Unique identifier
    id: generateUUID(),
  };

  config.name = generateSpiralName(config);

  return config;
};

// Function to adjust existing configs for theme changes
export const adjustConfigsForTheme = (
  configs: SpiralsConfig[],
): SpiralsConfig[] => {
  return configs.map((config) => ({
    ...config,
    id: generateUUID(), // Generate new UUID for each config
    lightness: adjustLightnessForTheme(config.lightness),
  }));
};

// Utility: Generate a file name for spiral SVG download
export function generateSpiralFileName(configs: { name?: string }[]): string {
  if (configs.length === 0) {
    return "spirals.svg";
  }
  if (configs.length === 1) {
    const name = configs[0]?.name || "spiral";
    return `${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
  }
  // For multiple sets, create a combined name
  const names = configs.map((config) =>
    (config?.name || "spiral").toLowerCase().replace(/\s+/g, "-"),
  );
  return `${names.join("-")}.svg`;
}

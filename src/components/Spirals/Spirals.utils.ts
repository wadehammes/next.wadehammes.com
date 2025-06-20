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

// Color conversion utilities
export const oklchToHex = (l: number, c: number, h: number): string => {
  // Use culori to convert OKLCH to hex
  const color = oklch({ mode: "oklch", l, c, h });
  return formatHex(color) || "#000000";
};

export const hexToOklch = (
  hex: string,
): { l: number; c: number; h: number } => {
  // Use culori to convert hex to OKLCH
  const color = oklch(parseHex(hex));
  if (!color) {
    return { l: 0.6, c: 0.2, h: 0 };
  }
  return {
    l: color.l,
    c: color.c,
    h: color.h,
  };
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

export const PRESET_CONFIGS = {
  calm: {
    ...DEFAULT_CONFIG,
    animationSpeed: 30000,
    spiralCount: 4,
    circleCount: 8,
    opacitySubtraction: 0.06,
    lightness: adjustLightnessForTheme(0.6),
    chroma: 0.15,
    hue: 180,
    shape: "circle",
    polygonSides: 6,
    name: "Peaceful Tranquil",
  },
  vibrant: {
    ...DEFAULT_CONFIG,
    animationSpeed: 30000,
    spiralCount: 8,
    circleCount: 16,
    opacitySubtraction: 0.1,
    lightness: adjustLightnessForTheme(0.7),
    chroma: 0.3,
    hue: 0,
    shape: "square",
    polygonSides: 4,
    name: "Vibrant Dynamic",
  },
  minimal: {
    ...DEFAULT_CONFIG,
    fill: false,
    strokeWidth: 2,
    spiralCount: 3,
    circleCount: 5,
    opacitySubtraction: 0.05,
    lightness: adjustLightnessForTheme(0.8),
    chroma: 0.05,
    hue: 0,
    shape: "triangle",
    polygonSides: 3,
    name: "Minimal Outline",
  },
  cosmic: {
    ...DEFAULT_CONFIG,
    animationSpeed: 30000,
    spiralCount: 10,
    circleCount: 18,
    opacitySubtraction: 0.12,
    lightness: adjustLightnessForTheme(0.4),
    chroma: 0.25,
    hue: 280,
    shape: "polygon",
    polygonSides: 8,
    name: "Cosmic Mysterious",
  },
  sunset: {
    ...DEFAULT_CONFIG,
    animationSpeed: 25000,
    spiralCount: 7,
    circleCount: 14,
    opacitySubtraction: 0.09,
    lightness: adjustLightnessForTheme(0.65),
    chroma: 0.28,
    hue: 30,
    shape: "circle",
    polygonSides: 6,
    name: "Warm Golden",
  },
  ocean: {
    ...DEFAULT_CONFIG,
    animationSpeed: 35000,
    spiralCount: 5,
    circleCount: 10,
    opacitySubtraction: 0.07,
    lightness: adjustLightnessForTheme(0.55),
    chroma: 0.22,
    hue: 200,
    shape: "square",
    polygonSides: 4,
    name: "Oceanic Cool",
  },
} as const;

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

  const config: SpiralsConfig = {
    animationSpeed: Math.floor(Math.random() * 20000) + 15000, // 15-35 seconds
    animationScale: Math.random() * 0.9 + 1.1, // 1.1-2.0
    spiralCount: Math.floor(Math.random() * 8) + 3, // 3-10
    circleCount: Math.floor(Math.random() * 26) + 5, // 5-30
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

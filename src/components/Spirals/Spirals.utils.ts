export const SPIRALS_CONSTANTS = {
  VIEWBOX: 1500,
  DEGREES_TO_RADIANS: (1 * Math.PI) / 180,
  OPACITY_SUBTRACTION: 0.075,
};

// Color conversion utilities
export const hslToHex = (h: number, s: number, l: number): string => {
  const lightness = l / 100;
  const a = (s * Math.min(lightness, 1 - lightness)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const cleanHex = hex.replace("#", "");

  const r = Number.parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = Number.parseInt(cleanHex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export interface SpiralsConfig {
  // Animation
  animationSpeed: number;
  animationScale: number;

  // Spiral Structure
  spiralCount: number;
  circleCount: number;
  circleOffset: number;
  circleRadius: number;

  // Visual Style
  fill: boolean;
  strokeWidth: number;
  opacitySubtraction: number;

  // Colors
  hue: number;
  saturation: number;
  lightness: number;

  // Metadata
  name?: string;
}

export const DEFAULT_CONFIG: SpiralsConfig = {
  // Animation
  animationSpeed: 30000,
  animationScale: 1,

  // Spiral Structure
  spiralCount: 6,
  circleCount: 12,
  circleOffset: 60,
  circleRadius: 40,

  // Visual Style
  fill: true,
  strokeWidth: 0,
  opacitySubtraction: 0.08,

  // Colors
  hue: 220,
  saturation: 60,
  lightness: 50,

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
    hue: 180,
    saturation: 40,
    name: "Peaceful Tranquil",
  },
  vibrant: {
    ...DEFAULT_CONFIG,
    animationSpeed: 30000,
    spiralCount: 8,
    circleCount: 16,
    opacitySubtraction: 0.1,
    hue: 0,
    saturation: 80,
    lightness: 60,
    name: "Vibrant Dynamic",
  },
  minimal: {
    ...DEFAULT_CONFIG,
    fill: false,
    strokeWidth: 2,
    spiralCount: 3,
    circleCount: 6,
    opacitySubtraction: 0.05,
    hue: 0,
    saturation: 0,
    lightness: 70,
    name: "Minimal Outline",
  },
  cosmic: {
    ...DEFAULT_CONFIG,
    animationSpeed: 30000,
    spiralCount: 10,
    circleCount: 18,
    opacitySubtraction: 0.12,
    hue: 280,
    saturation: 70,
    lightness: 40,
    name: "Cosmic Mysterious",
  },
  sunset: {
    ...DEFAULT_CONFIG,
    animationSpeed: 25000,
    spiralCount: 7,
    circleCount: 14,
    opacitySubtraction: 0.09,
    hue: 30,
    saturation: 75,
    lightness: 55,
    name: "Warm Golden",
  },
  ocean: {
    ...DEFAULT_CONFIG,
    animationSpeed: 35000,
    spiralCount: 5,
    circleCount: 10,
    opacitySubtraction: 0.07,
    hue: 200,
    saturation: 65,
    lightness: 45,
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
    config.circleRadius < 10
      ? ["Tiny", "Micro", "Dotted"]
      : config.circleRadius < 25
        ? ["Small", "Delicate", "Fine"]
        : config.circleRadius < 45
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
  const config: SpiralsConfig = {
    animationSpeed: Math.floor(Math.random() * 20000) + 15000, // 15-35 seconds
    animationScale: Math.random() * 0.9 + 0.85, // 0.85-1.75
    spiralCount: Math.floor(Math.random() * 8) + 3, // 3-10
    circleCount: Math.floor(Math.random() * 12) + 6, // 6-17
    circleOffset: Math.floor(Math.random() * 80) + 30, // 30-110
    circleRadius: Math.floor(Math.random() * 78) + 2, // 2-80 (tiny dots to large circles)
    fill: Math.random() > 0.5,
    strokeWidth: Math.random() * 6, // 0-6
    opacitySubtraction: Math.random() * 0.08 + 0.04, // 0.04-0.12
    hue: Math.floor(Math.random() * 360),
    saturation: Math.floor(Math.random() * 50) + 30, // 30-80
    lightness: Math.floor(Math.random() * 40) + 30, // 30-70
  };

  config.name = generateSpiralName(config);
  return config;
};

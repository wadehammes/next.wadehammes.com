export const isGeckoEngine = (userAgent: string): boolean =>
  /firefox|gecko\//i.test(userAgent);

const isReducedMotionPreferred = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

let cachedGecko: boolean | null = null;
let cachedReducedMotion: boolean | null = null;

export const isSpiralsReducedMotionBrowser = (): boolean => {
  if (cachedReducedMotion !== null) {
    return cachedReducedMotion;
  }

  cachedReducedMotion = isReducedMotionPreferred();
  return cachedReducedMotion;
};

export const preferSpiralsLayeredSvg = (): boolean => preferCssSetRotation();

export const preferCssSetRotation = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  if (cachedGecko !== null) {
    return cachedGecko;
  }

  cachedGecko = isGeckoEngine(navigator.userAgent);
  return cachedGecko;
};

export const shouldRunSpiralGsapAnimations = (): boolean =>
  !preferCssSetRotation() && !isSpiralsReducedMotionBrowser();

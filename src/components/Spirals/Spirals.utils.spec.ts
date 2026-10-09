import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  createRandomConfigSet,
  DEFAULT_CONFIG,
  estimateSpiralReach,
  generateRandomConfig,
  generateSpiralFileName,
  getPolygonPoints,
  getTrianglePoints,
  HARMONIC_SPIRAL_COUNTS,
  harmonicConfigSetPassesQualityGate,
  hexToOklch,
  MIN_HERO_SPIRAL_REACH,
  oklchToHex,
  resolveLightnessForTheme,
  SPIRALS_CONSTANTS,
  scoreHarmonicConfigSet,
  sortConfigsForPaintOrder,
} from "src/components/Spirals/Spirals.utils";

describe("SPIRALS_CONSTANTS", () => {
  it("defines the shared viewbox size", () => {
    expect(SPIRALS_CONSTANTS.VIEWBOX).toBe(1500);
  });
});

describe("getPolygonPoints", () => {
  it("returns space-separated vertex pairs for the requested side count", () => {
    const points = getPolygonPoints(100, 100, 50, 6);
    const pairs = points.split(" ");

    expect(pairs).toHaveLength(6);
    for (const pair of pairs) {
      expect(pair).toMatch(/^-?\d+\.?\d*,-?\d+\.?\d*$/);
    }
  });

  it("returns cached output for identical inputs", () => {
    const first = getPolygonPoints(10, 20, 30, 5);
    const second = getPolygonPoints(10, 20, 30, 5);

    expect(first).toBe(second);
  });
});

describe("getTrianglePoints", () => {
  it("returns three coordinate pairs", () => {
    const points = getTrianglePoints(0, 0, 10);

    expect(points.split(" ")).toHaveLength(3);
  });
});

describe("hexToOklch and oklchToHex", () => {
  it("round-trips a hex color through OKLCH", () => {
    const sourceHex = "#62929e";
    const oklchColor = hexToOklch(sourceHex);
    const roundTrippedHex = oklchToHex(
      oklchColor.l,
      oklchColor.c,
      oklchColor.h,
    );

    expect(roundTrippedHex.toLowerCase()).toBe(sourceHex);
  });

  it("falls back when hex parsing fails", () => {
    expect(hexToOklch("not-a-color")).toEqual({ l: 0.5, c: 0.2, h: 0 });
  });
});

describe("generateRandomConfig", () => {
  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    jest.spyOn(crypto, "randomUUID").mockReturnValue("test-spiral-id");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a harmonic SpiralsConfig within expected bounds", () => {
    const config = generateRandomConfig();

    expect(config.id).toBe("test-spiral-id");
    expect(HARMONIC_SPIRAL_COUNTS).toContain(config.spiralCount);
    expect([5, 8, 13, 21]).toContain(config.circleCount);
    expect(config.animationSpeed).toBeGreaterThanOrEqual(15000);
    expect(config.spiralSpacing).toBeGreaterThanOrEqual(0.75);
    expect(config.spiralSpacing).toBeLessThanOrEqual(1);
    expect(config.circleOffset * config.spiralSpacing).toBeGreaterThanOrEqual(
      config.elementSize * 1.12,
    );
    expect(estimateSpiralReach(config)).toBeGreaterThanOrEqual(
      MIN_HERO_SPIRAL_REACH,
    );
    expect(config.name).toBeTruthy();
    expect(["circle", "square", "triangle", "polygon"]).toContain(config.shape);
  });

  it("aligns an added layer with an existing set", () => {
    const base = generateRandomConfig();
    const added = generateRandomConfig([base]);

    expect(added.spiralCount).toBe(base.spiralCount);
    expect(Math.abs(added.hue - base.hue)).toBeLessThanOrEqual(180);
    expect(added.animationScale).toBeLessThan(base.animationScale);
    expect(added.elementSize).toBeLessThanOrEqual(base.elementSize);
  });
});

describe("createRandomConfigSet", () => {
  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    jest.spyOn(crypto, "randomUUID").mockReturnValue("harmonic-set-id");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 3–4 layers that pass the harmonic quality gate", () => {
    const configs = createRandomConfigSet();

    expect(configs.length).toBeGreaterThanOrEqual(3);
    expect(configs.length).toBeLessThanOrEqual(4);

    expect(harmonicConfigSetPassesQualityGate(configs)).toBe(true);

    const spiralCounts = new Set(configs.map((config) => config.spiralCount));
    expect(spiralCounts.size).toBe(1);

    const pulseLayers = configs.filter((config) => config.pulseEnabled);
    expect(pulseLayers.length).toBeLessThanOrEqual(1);

    const maxReach = Math.max(...configs.map(estimateSpiralReach));
    expect(maxReach).toBeGreaterThanOrEqual(MIN_HERO_SPIRAL_REACH);

    for (let i = 0; i < configs.length - 1; i++) {
      expect(configs[i]?.animationScale).toBeGreaterThan(
        configs[i + 1]?.animationScale ?? 0,
      );
    }
  });
});

describe("sortConfigsForPaintOrder", () => {
  it("draws larger animationScale configs before smaller ones (back to front)", () => {
    const large = {
      ...DEFAULT_CONFIG,
      id: "large",
      animationScale: 1.7,
      elementSize: 50,
    };
    const small = {
      ...DEFAULT_CONFIG,
      id: "small",
      animationScale: 1.1,
      elementSize: 20,
    };

    const ordered = sortConfigsForPaintOrder([small, large]);

    expect(ordered.map((config) => config.id)).toEqual(["large", "small"]);
  });
});

describe("scoreHarmonicConfigSet", () => {
  it("penalizes clashing multi-pulse sets", () => {
    const base = { ...DEFAULT_CONFIG };
    const clashing = [
      { ...base, id: "a", pulseEnabled: true, spiralCount: 6, circleCount: 21 },
      { ...base, id: "b", pulseEnabled: true, spiralCount: 6, circleCount: 21 },
    ];
    const calm = [
      { ...base, id: "c", pulseEnabled: true, spiralCount: 6, circleCount: 8 },
      { ...base, id: "d", pulseEnabled: false, spiralCount: 6, circleCount: 8 },
    ];

    expect(scoreHarmonicConfigSet(clashing)).toBeLessThan(
      scoreHarmonicConfigSet(calm),
    );
  });
});

describe("resolveLightnessForTheme", () => {
  beforeEach(() => {
    document.body.dataset.theme = "dark";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete document.body.dataset.theme;
  });

  it("leaves base lightness unchanged in dark mode", () => {
    expect(resolveLightnessForTheme(0.8)).toBe(0.8);
  });

  it("reduces lightness in light mode without mutating stored base", () => {
    document.body.dataset.theme = "light";
    const base = 0.8;
    const display = resolveLightnessForTheme(base);

    expect(display).toBeLessThan(base);
    expect(display).toBeGreaterThanOrEqual(0.2);
    expect(base).toBe(0.8);
  });
});

describe("generateSpiralFileName", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-19T12:30:45.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("includes config names and a filesystem-safe timestamp", () => {
    const fileName = generateSpiralFileName([
      { name: "Cool Filled" },
      { name: "Deep Outline" },
    ]);

    expect(fileName).toBe(
      "spirals-Cool Filled-Deep Outline-2026-07-19T12-30-45.svg",
    );
  });
});

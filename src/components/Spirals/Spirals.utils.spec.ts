import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import {
  adjustConfigsForTheme,
  DEFAULT_CONFIG,
  generateRandomConfig,
  generateSpiralFileName,
  getPolygonPoints,
  getTrianglePoints,
  hexToOklch,
  oklchToHex,
  SPIRALS_CONSTANTS,
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

  it("returns a complete SpiralsConfig within expected bounds", () => {
    const config = generateRandomConfig();

    expect(config.id).toBe("test-spiral-id");
    expect(config.spiralCount).toBeGreaterThanOrEqual(3);
    expect(config.spiralCount).toBeLessThanOrEqual(6);
    expect(config.circleCount).toBeGreaterThanOrEqual(5);
    expect(config.animationSpeed).toBeGreaterThanOrEqual(15000);
    expect(config.name).toBeTruthy();
    expect(["circle", "square", "triangle", "polygon"]).toContain(config.shape);
  });
});

describe("adjustConfigsForTheme", () => {
  beforeEach(() => {
    jest.spyOn(crypto, "randomUUID").mockReturnValue("theme-adjusted-id");
    document.body.dataset.theme = "dark";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete document.body.dataset.theme;
  });

  it("assigns new ids while preserving other config fields", () => {
    const config = { ...DEFAULT_CONFIG, id: "original-id", elementSize: 42 };
    const [adjusted] = adjustConfigsForTheme([config]);

    expect(adjusted.id).toBe("theme-adjusted-id");
    expect(adjusted.elementSize).toBe(42);
  });

  it("reduces lightness in light mode", () => {
    document.body.dataset.theme = "light";
    const [adjusted] = adjustConfigsForTheme([
      { ...DEFAULT_CONFIG, lightness: 0.8 },
    ]);

    expect(adjusted.lightness).toBeLessThan(0.8);
    expect(adjusted.lightness).toBeGreaterThanOrEqual(0.2);
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

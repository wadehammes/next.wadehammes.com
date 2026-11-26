import { describe, expect, it } from "@jest/globals";
import {
  isGeckoEngine,
  preferCssSetRotation,
  shouldRunSpiralGsapAnimations,
} from "src/helpers/spiralsAnimation";

describe("isGeckoEngine", () => {
  it("matches Firefox user agents", () => {
    expect(
      isGeckoEngine(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0",
      ),
    ).toBe(true);
  });

  it("uses GSAP set motion in Jest (no navigator gecko)", () => {
    expect(shouldRunSpiralGsapAnimations()).toBe(true);
    expect(preferCssSetRotation()).toBe(false);
  });

  it("does not match Chromium user agents", () => {
    expect(
      isGeckoEngine(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      ),
    ).toBe(false);
  });
});

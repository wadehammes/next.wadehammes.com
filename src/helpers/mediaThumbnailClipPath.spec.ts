import { describe, expect, it } from "@jest/globals";
import { getMediaThumbnailClipPath } from "src/helpers/mediaThumbnailClipPath";

describe("getMediaThumbnailClipPath", () => {
  it("returns a polygon clip path", () => {
    const clipPath = getMediaThumbnailClipPath(
      "https://soundcloud.com/wadehammes/saturday-morning-disco-hour",
    );

    expect(clipPath).toMatch(/^polygon\(/);
    expect(clipPath).toContain("%");
  });

  it("is stable for the same seed", () => {
    const seed = "https://www.mixcloud.com/wadehammes/sunday-sessions-001/";
    expect(getMediaThumbnailClipPath(seed)).toBe(
      getMediaThumbnailClipPath(seed),
    );
  });

  it("varies clip paths across different seeds", () => {
    const a = getMediaThumbnailClipPath("https://soundcloud.com/a/track");
    const b = getMediaThumbnailClipPath("https://soundcloud.com/b/track");

    expect(a).not.toBe(b);
  });

  it("returns a distinct hover clip with the same vertex count", () => {
    const seed = "https://www.mixcloud.com/wadehammes/sunday-sessions-001/";
    const defaultClip = getMediaThumbnailClipPath(seed, "default");
    const hoverClip = getMediaThumbnailClipPath(seed, "hover");

    expect(hoverClip).not.toBe(defaultClip);
    const pointCount = (clip: string) => (clip.match(/%/g) ?? []).length / 2;
    expect(pointCount(defaultClip)).toBe(pointCount(hoverClip));
  });
});

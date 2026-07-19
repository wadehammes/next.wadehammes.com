import { describe, expect, it } from "@jest/globals";
import type { ImageField } from "@prismicio/client";
import { parseImage } from "src/prismic/parseImage";

describe("parseImage", () => {
  it("returns null when the image field is empty", () => {
    expect(parseImage({})).toBeNull();
  });

  it("returns url and dimensions for a filled image", () => {
    const field = {
      alt: "Open graph image",
      copyright: null,
      dimensions: { height: 630, width: 1200 },
      edit: { background: "transparent", x: 0, y: 0, zoom: 1 },
      id: "image-id",
      url: "https://images.prismic.io/example/og.png",
    } satisfies ImageField;

    expect(parseImage(field)).toEqual({
      height: 630,
      url: "https://images.prismic.io/example/og.png",
      width: 1200,
    });
  });
});

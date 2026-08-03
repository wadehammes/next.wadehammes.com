import { describe, expect, it } from "@jest/globals";
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from "src/helpers/youtube";

describe("getYouTubeVideoId", () => {
  it("parses watch, youtu.be, embed, and shorts URLs", () => {
    expect(
      getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(getYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(
      getYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns null for non-YouTube URLs", () => {
    expect(getYouTubeVideoId("https://filtermydisco.gs/")).toBeNull();
    expect(getYouTubeVideoId("not-a-url")).toBeNull();
  });
});

describe("buildYouTubeEmbedUrl", () => {
  it("builds an embed URL with optional autoplay", () => {
    expect(buildYouTubeEmbedUrl("abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
    expect(buildYouTubeEmbedUrl("abc123", true)).toBe(
      "https://www.youtube.com/embed/abc123?autoplay=1",
    );
  });
});

describe("buildYouTubeThumbnailUrl", () => {
  it("builds a YouTube thumbnail URL from the video id", () => {
    expect(buildYouTubeThumbnailUrl("abc123")).toBe(
      "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
    );
  });
});

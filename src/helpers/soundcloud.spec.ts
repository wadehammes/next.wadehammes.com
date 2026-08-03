import { describe, expect, it } from "@jest/globals";
import {
  buildSoundCloudEmbedUrl,
  isSoundCloudUrl,
} from "src/helpers/soundcloud";

describe("isSoundCloudUrl", () => {
  it("detects SoundCloud track and short URLs", () => {
    expect(isSoundCloudUrl("https://soundcloud.com/artist/track-name")).toBe(
      true,
    );
    expect(isSoundCloudUrl("https://on.soundcloud.com/abc123")).toBe(true);
  });

  it("returns false for non-SoundCloud URLs", () => {
    expect(isSoundCloudUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      false,
    );
    expect(isSoundCloudUrl("not-a-url")).toBe(false);
  });
});

describe("buildSoundCloudEmbedUrl", () => {
  it("builds a SoundCloud player URL with optional autoplay", () => {
    const trackUrl = "https://soundcloud.com/artist/track-name";
    expect(buildSoundCloudEmbedUrl(trackUrl)).toBe(
      "https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fartist%2Ftrack-name&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    );
    expect(buildSoundCloudEmbedUrl(trackUrl, true)).toContain("auto_play=true");
  });
});

import { describe, expect, it } from "@jest/globals";
import { buildMixcloudEmbedUrl, isMixcloudUrl } from "src/helpers/mixcloud";

describe("isMixcloudUrl", () => {
  it.each([
    ["https://www.mixcloud.com/wadehammes/saturday-morning-disco-hour/", true],
    ["https://mixcloud.com/user/show-name/", true],
    ["https://www.mixcloud.com/widget/iframe/", false],
    ["https://soundcloud.com/wadehammes/track", false],
    ["not-a-url", false],
  ])("classifies %s as %s", (url, expected) => {
    expect(isMixcloudUrl(url)).toBe(expected);
  });
});

describe("buildMixcloudEmbedUrl", () => {
  it("builds a widget iframe URL with feed path and autoplay", () => {
    const embed = buildMixcloudEmbedUrl(
      "https://www.mixcloud.com/wadehammes/saturday-morning-disco-hour",
      true,
    );

    expect(embed).toContain("www.mixcloud.com/widget/iframe/");
    expect(embed).toContain(
      "feed=%2Fwadehammes%2Fsaturday-morning-disco-hour%2F",
    );
    expect(embed).toContain("hide_cover=0");
    expect(embed).toContain("mini=0");
    expect(embed).toContain("autoplay=1");
  });
});

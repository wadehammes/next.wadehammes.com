import { describe, expect, it } from "@jest/globals";
import { buildFaviconUrl, getLinkHostname } from "src/helpers/favicon";

describe("getLinkHostname", () => {
  it("returns a normalized hostname from a URL", () => {
    expect(getLinkHostname("https://www.filtermydisco.gs/")).toBe(
      "filtermydisco.gs",
    );
    expect(getLinkHostname("https://github.com/wadehammes")).toBe("github.com");
  });

  it("returns null for invalid URLs", () => {
    expect(getLinkHostname("not-a-url")).toBeNull();
  });
});

describe("buildFaviconUrl", () => {
  it("builds a Google favicon service URL from the link hostname", () => {
    expect(buildFaviconUrl("https://filtermydisco.gs/")).toBe(
      "https://www.google.com/s2/favicons?domain=filtermydisco.gs&sz=32",
    );
  });

  it("returns null for invalid URLs", () => {
    expect(buildFaviconUrl("not-a-url")).toBeNull();
  });
});

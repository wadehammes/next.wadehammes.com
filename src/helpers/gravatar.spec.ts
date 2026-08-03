import { describe, expect, it } from "@jest/globals";
import { buildGravatarUrl, getGravatarHash } from "src/helpers/gravatar";

describe("getGravatarHash", () => {
  it("returns the MD5 hash of a normalized email address", () => {
    expect(getGravatarHash("  W@DeHammes.com ")).toBe(
      "764ba94f7114d036da927c0c306bd78c",
    );
  });
});

describe("buildGravatarUrl", () => {
  it("builds a Gravatar URL with size and 404 default", () => {
    expect(buildGravatarUrl("w@dehammes.com")).toBe(
      "https://www.gravatar.com/avatar/764ba94f7114d036da927c0c306bd78c?s=208&d=404",
    );
  });

  it("supports a custom image size", () => {
    expect(buildGravatarUrl("w@dehammes.com", 104)).toBe(
      "https://www.gravatar.com/avatar/764ba94f7114d036da927c0c306bd78c?s=104&d=404",
    );
  });
});

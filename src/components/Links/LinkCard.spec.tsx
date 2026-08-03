import { describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { LinkCard } from "src/components/Links/LinkCard.component";
import type { ParsedLinkItem } from "src/prismic/parseLinks";
import { render, screen } from "test-utils";

const externalItem: ParsedLinkItem = {
  description: "Browse your collection.",
  embedThumbnailUrl: null,
  href: "https://filtermydisco.gs/",
  kind: "external",
  label: "FilterMyDiscogs",
  youtubeVideoId: null,
};

const youtubeItem: ParsedLinkItem = {
  description: "August 6, 2022",
  embedThumbnailUrl: null,
  href: "https://www.youtube.com/watch?v=abc123xyz12",
  kind: "youtube",
  label: "Saturday morning disco hour+",
  youtubeVideoId: "abc123xyz12",
};

const soundCloudItem: ParsedLinkItem = {
  description: "August 6, 2022",
  embedThumbnailUrl: "https://i1.sndcdn.com/artworks-abc-large.jpg",
  href: "https://soundcloud.com/wadehammes/saturday-morning-disco-hour",
  kind: "soundcloud",
  label: "Saturday morning disco hour+",
  youtubeVideoId: null,
};

describe("LinkCard", () => {
  it("renders an external link", () => {
    render(<LinkCard item={externalItem} />);

    const link = screen.getByRole("link", { name: /FilterMyDiscogs/i });
    expect(link).toHaveAttribute("href", "https://filtermydisco.gs/");
    expect(link.querySelector("img")).toHaveAttribute(
      "src",
      "https://www.google.com/s2/favicons?domain=filtermydisco.gs&sz=32",
    );
  });

  it("expands a YouTube embed when play is clicked", async () => {
    const user = userEvent.setup();
    render(<LinkCard item={youtubeItem} />);

    const button = screen.getByRole("button", {
      name: /Saturday morning disco hour+/i,
    });
    expect(button.querySelector("img")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/abc123xyz12/hqdefault.jpg",
    );

    expect(
      screen.queryByTitle("Saturday morning disco hour+"),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Saturday morning disco hour+/i }),
    );

    expect(
      screen.getByTitle("Saturday morning disco hour+"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hide/i })).toBeInTheDocument();
  });

  it("expands a SoundCloud embed when play is clicked", async () => {
    const user = userEvent.setup();
    render(<LinkCard item={soundCloudItem} />);

    const button = screen.getByRole("button", {
      name: /Saturday morning disco hour+/i,
    });
    expect(button.querySelector("img")).toHaveAttribute(
      "src",
      "https://i1.sndcdn.com/artworks-abc-large.jpg",
    );

    await user.click(button);

    expect(
      screen.getByTitle("Saturday morning disco hour+"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hide/i })).toBeInTheDocument();
  });
});

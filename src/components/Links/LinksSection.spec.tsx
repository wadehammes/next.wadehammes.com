import { describe, expect, it } from "@jest/globals";
import { LinksSection } from "src/components/Links/LinksSection.component";
import type { ParsedLinkItem } from "src/prismic/parseLinks";
import { render, screen, userEvent } from "test-utils";

jest.mock("next/image");

const mediaItems: ParsedLinkItem[] = [
  {
    kind: "youtube",
    href: "https://www.youtube.com/watch?v=abc123xyz12",
    label: "Sunday Sessions 001",
    description: "A short mix.",
    embedThumbnailUrl: null,
    youtubeVideoId: "abc123xyz12",
  },
];

describe("LinksSection", () => {
  it("renders the section heading and collapsible set rows", async () => {
    const user = userEvent.setup();

    render(
      <LinksSection section={{ title: "Past DJ sets", items: mediaItems }} />,
    );

    expect(
      screen.getByRole("heading", { name: /Past DJ sets/i }),
    ).toBeInTheDocument();

    const setTrigger = screen.getByRole("button", {
      name: /Sunday Sessions 001/i,
    });
    expect(setTrigger).toBeInTheDocument();
    expect(screen.queryByTitle("Sunday Sessions 001")).not.toBeInTheDocument();

    await user.click(setTrigger);

    expect(screen.getByTitle("Sunday Sessions 001")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Stop/i })).toBeInTheDocument();
  });
});

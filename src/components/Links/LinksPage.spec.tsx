import { describe, expect, it } from "@jest/globals";
import { linksPagePageObject } from "src/components/Links/LinksPage.po";
import { SITE_EMAIL } from "src/constants/site";
import { buildGravatarUrl } from "src/helpers/gravatar";
import { linksDocumentFactory } from "src/tests/factories/LinksDocument.factory";
import { screen } from "test-utils";

describe("LinksPage", () => {
  it("renders profile copy and link cards from Prismic", () => {
    linksPagePageObject.renderLinksPage();

    expect(screen.getByRole("img", { name: "Wade Hammes" })).toHaveAttribute(
      "src",
      buildGravatarUrl(SITE_EMAIL),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Wade Hammes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Someone told me this would make me relevant."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "All the links" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /FilterMyDiscogs/i }),
    ).toHaveAttribute("href", "https://filtermydisco.gs/");
  });

  it("shows a fallback message when no sections are available", () => {
    linksPagePageObject.renderLinksPage({ linksPage: null });

    expect(
      screen.getByText("Links will appear here once published in Prismic."),
    ).toBeInTheDocument();
  });

  it("renders without a tagline when Prismic leaves it empty", () => {
    linksPagePageObject.renderLinksPage({
      linksPage: linksDocumentFactory.buildParsedPage({
        data: { tagline: null },
      }),
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "Wade Hammes" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Someone told me this would make me relevant."),
    ).not.toBeInTheDocument();
  });
});

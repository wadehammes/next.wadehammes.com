import { beforeEach, describe, expect, it } from "@jest/globals";
import { HomePagePageObject } from "src/components/HomePage/HomePage.po";
import { screen, userEvent } from "test-utils";

let po: HomePagePageObject;

describe("HomePage", () => {
  beforeEach(() => {
    po = new HomePagePageObject();
  });

  it("renders Prismic bio copy in the footer", () => {
    po.renderHomePage({
      homePage: po.buildHomePageWithHeading("Hi, I'm Wade."),
    });

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(screen.getByTestId("rhBio")).toBeInTheDocument();
    expect(screen.getByText("Hi, I'm Wade.")).toBeInTheDocument();
  });

  it("omits bio copy when Prismic copy is missing", () => {
    po.renderHomePage({ homePage: po.buildHomePageWithoutCopy() });

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(screen.queryByTestId("rhBio")).not.toBeInTheDocument();
  });

  it("opens spiral controls from the footer actions", async () => {
    po.renderHomePage({ homePage: po.buildHomePage() });

    await userEvent.click(screen.getByRole("button", { name: "Controls" }));

    expect(screen.getByTestId("rhSpiralsControls")).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Spiral controls panel" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("rhSpiralsActions")).not.toBeInTheDocument();
  });
});

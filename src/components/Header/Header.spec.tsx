import { beforeEach, describe, expect, it } from "@jest/globals";
import { HeaderPageObject } from "src/components/Header/Header.po";
import { screen } from "test-utils";

let po: HeaderPageObject;

describe("Header", () => {
  beforeEach(() => {
    po = new HeaderPageObject();
  });

  it("renders the site logo linking home", () => {
    po.renderHeader();

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });
});

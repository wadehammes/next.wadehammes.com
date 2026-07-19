import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ButtonPageObject } from "src/components/Button/Button.po";
import { screen, userEvent } from "test-utils";

let po: ButtonPageObject;

describe("Button", () => {
  beforeEach(() => {
    po = new ButtonPageObject();
  });

  it("renders with an accessible label", () => {
    po.renderButton({ label: "Save changes" });

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("calls the click handler", async () => {
    const handleClick = jest.fn();
    po.renderButton({ handleClick, label: "Save changes" });

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

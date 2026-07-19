import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SpiralsControlsPageObject } from "src/components/Spirals/SpiralsControls.po";
import { screen, userEvent } from "test-utils";

let po: SpiralsControlsPageObject;

describe("SpiralsControls", () => {
  beforeEach(() => {
    po = new SpiralsControlsPageObject();
  });

  it("renders the spiral controls dialog", () => {
    po.renderSpiralsControls();

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Spiral controls panel" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Spiral Controls")).toBeInTheDocument();
    expect(screen.getByText("Test Set")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const onToggleAction = jest.fn();
    po.renderSpiralsControls({ onToggleAction });

    await userEvent.click(
      screen.getByRole("button", { name: "Close controls" }),
    );

    expect(onToggleAction).toHaveBeenCalledTimes(1);
  });

  it("closes when Escape is pressed", async () => {
    const onToggleAction = jest.fn();
    po.renderSpiralsControls({ onToggleAction });

    screen.getByRole("dialog", { name: "Spiral controls panel" }).focus();
    await userEvent.keyboard("{Escape}");

    expect(onToggleAction).toHaveBeenCalledTimes(1);
  });

  it("calls the randomize handler", async () => {
    const onRandomizeAllAction = jest.fn();
    po.renderSpiralsControls({ onRandomizeAllAction });

    await userEvent.click(
      screen.getByRole("button", { name: "Randomize all spiral sets" }),
    );

    expect(onRandomizeAllAction).toHaveBeenCalledTimes(1);
  });

  it("calls the add spiral set handler", async () => {
    const onAddSpiralSetAction = jest.fn();
    po.renderSpiralsControls({ onAddSpiralSetAction });

    await userEvent.click(screen.getByText("+ Add"));

    expect(onAddSpiralSetAction).toHaveBeenCalledTimes(1);
  });
});

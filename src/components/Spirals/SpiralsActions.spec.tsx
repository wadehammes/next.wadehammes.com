import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { generateSpiralFileName } from "src/components/Spirals/Spirals.utils";
import {
  mockedSaveSvg,
  SpiralsActionsPageObject,
} from "src/components/Spirals/SpiralsActions.po";
import { mockMatchMediaQueries } from "src/tests/mocks/mockMatchMedia";
import { screen, userEvent } from "test-utils";

let po: SpiralsActionsPageObject;

describe("SpiralsActions", () => {
  beforeEach(() => {
    po = new SpiralsActionsPageObject();
    mockMatchMediaQueries({});
  });

  it("renders the footer spiral actions", () => {
    po.renderSpiralsActions();

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Controls" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Spirals" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download SVG" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Light mode" }),
    ).toBeInTheDocument();
  });

  it("hides the actions while the playground is open", () => {
    po.renderSpiralsActions({ isPlaygroundOpen: true });

    expect(screen.queryByTestId(po.testId)).not.toBeInTheDocument();
  });

  it("calls the playground toggle handler", async () => {
    const onTogglePlayground = jest.fn();
    po.renderSpiralsActions({ onTogglePlayground });

    await userEvent.click(screen.getByRole("button", { name: "Controls" }));

    expect(onTogglePlayground).toHaveBeenCalledTimes(1);
  });

  it("calls the randomize handler", async () => {
    const onRandomizeAllAction = jest.fn();
    po.renderSpiralsActions({ onRandomizeAllAction });

    await userEvent.click(screen.getByRole("button", { name: "New Spirals" }));

    expect(onRandomizeAllAction).toHaveBeenCalledTimes(1);
  });

  it("downloads the current fractal svg", async () => {
    const spiralConfigs = po.buildConfigs();
    po.renderSpiralsActions({ spiralConfigs });

    await userEvent.click(screen.getByRole("button", { name: "Download SVG" }));

    expect(mockedSaveSvg).toHaveBeenCalledWith(
      ".fractal",
      generateSpiralFileName(spiralConfigs),
    );
  });

  it("toggles the preferred theme", async () => {
    po.renderSpiralsActions();

    await userEvent.click(screen.getByRole("button", { name: "Light mode" }));

    expect(window.localStorage.getItem("preferred-theme")).toBe("light");
    expect(document.body.dataset.theme).toBe("light");
    expect(
      screen.getByRole("button", { name: "Dark mode" }),
    ).toBeInTheDocument();
  });

  it("uses left-positioned tooltips when the desktop layout is active", () => {
    mockMatchMediaQueries({ "(min-width: 72rem)": true });
    po.renderSpiralsActions();

    expect(screen.getByText("Controls").className).toContain("tooltipLeft");
  });
});

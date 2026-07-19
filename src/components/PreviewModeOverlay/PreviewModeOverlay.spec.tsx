import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  mockedFetch,
  PreviewModeOverlayPageObject,
} from "src/components/PreviewModeOverlay/PreviewModeOverlay.po";
import { mockNextNavigation } from "src/tests/mocks/mockNextNavigation";
import { screen, userEvent } from "test-utils";

let po: PreviewModeOverlayPageObject;

describe("PreviewModeOverlay", () => {
  beforeEach(() => {
    po = new PreviewModeOverlayPageObject();
    mockedFetch.mockReset();
    po.mockExitPreviewSuccess();
  });

  it("renders the preview mode pill", () => {
    po.renderPreviewModeOverlay();

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(screen.getByText("Preview mode")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Exit preview mode" }),
    ).toBeInTheDocument();
  });

  it("exits preview mode when the close button is clicked", async () => {
    po.renderPreviewModeOverlay({ exitPreviewPath: "/api/exit-preview" });

    await userEvent.click(
      screen.getByRole("button", { name: "Exit preview mode" }),
    );

    expect(mockedFetch).toHaveBeenCalledWith("/api/exit-preview", {
      method: "GET",
    });
    expect(mockNextNavigation.router.refresh).toHaveBeenCalledTimes(1);
  });

  it("exits preview mode when Escape is pressed", async () => {
    po.renderPreviewModeOverlay();

    await userEvent.keyboard("{Escape}");

    expect(mockedFetch).toHaveBeenCalledWith("/api/exit-preview", {
      method: "GET",
    });
    expect(mockNextNavigation.router.refresh).toHaveBeenCalledTimes(1);
  });
});

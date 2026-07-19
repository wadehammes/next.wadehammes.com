import type { ComponentProps } from "react";
import { PreviewModeOverlay } from "src/components/PreviewModeOverlay/PreviewModeOverlay.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "test-utils";

export const mockedFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

export class PreviewModeOverlayPageObject extends BasePageObject {
  testId = "rhPreviewModeOverlay";

  renderPreviewModeOverlay(
    props: ComponentProps<typeof PreviewModeOverlay> = {},
  ) {
    global.fetch = mockedFetch as typeof fetch;

    return render(<PreviewModeOverlay {...props} />);
  }

  mockExitPreviewSuccess() {
    mockedFetch.mockResolvedValue({ ok: true } as Response);
  }
}

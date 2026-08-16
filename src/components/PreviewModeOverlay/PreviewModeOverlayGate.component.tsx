import { draftMode } from "next/headers";
import { PreviewModeOverlay } from "src/components/PreviewModeOverlay/PreviewModeOverlay.component";

export async function PreviewModeOverlayGate() {
  const isPreview = (await draftMode()).isEnabled;

  return isPreview ? <PreviewModeOverlay /> : null;
}

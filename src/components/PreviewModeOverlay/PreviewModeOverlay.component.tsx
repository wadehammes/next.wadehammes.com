"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface PreviewModeOverlayProps {
  /** Route handler that ends Draft Mode (default matches `@prismicio/next` / `PrismicPreview`). */
  exitPreviewPath?: string;
}

export const PreviewModeOverlay = ({
  exitPreviewPath = "/api/exit-preview",
}: PreviewModeOverlayProps) => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const exit = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(exitPreviewPath, { method: "GET" });
      if (!res.ok) {
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [exitPreviewPath, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        void exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exit]);

  return (
    <section className="prismic-preview" aria-label="Prismic preview mode">
      <div className="prismic-preview__pill">
        <span className="prismic-preview__label">Preview mode</span>
        <button
          type="button"
          className="prismic-preview__close"
          onClick={exit}
          disabled={busy}
          aria-label="Exit preview mode"
        >
          ×
        </button>
      </div>
    </section>
  );
};

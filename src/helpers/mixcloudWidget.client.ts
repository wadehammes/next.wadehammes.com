"use client";

const MIXCLOUD_WIDGET_API = "https://www.mixcloud.com/media/js/widgetApi.js";

interface MixcloudPlayerWidget {
  play: () => Promise<void>;
  ready: Promise<void>;
}

declare global {
  interface Window {
    Mixcloud?: {
      PlayerWidget: (iframe: HTMLIFrameElement) => MixcloudPlayerWidget;
    };
  }
}

let widgetApiPromise: Promise<void> | null = null;

const loadMixcloudWidgetApi = (): Promise<void> => {
  if (window.Mixcloud?.PlayerWidget) {
    return Promise.resolve();
  }

  if (!widgetApiPromise) {
    widgetApiPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${MIXCLOUD_WIDGET_API}"]`,
      );
      if (existing) {
        if (window.Mixcloud?.PlayerWidget) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Mixcloud widget API failed to load")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = MIXCLOUD_WIDGET_API;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Mixcloud widget API failed to load"));
      document.body.appendChild(script);
    });
  }

  return widgetApiPromise;
};

export const playMixcloudEmbed = async (
  iframe: HTMLIFrameElement,
): Promise<void> => {
  await loadMixcloudWidgetApi();
  if (!window.Mixcloud?.PlayerWidget) {
    return;
  }

  const widget = window.Mixcloud.PlayerWidget(iframe);
  await widget.ready;
  await widget.play();
};

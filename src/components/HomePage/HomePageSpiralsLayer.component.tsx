"use client";

import { memo, Suspense } from "react";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { SpiralsBrowserGate } from "src/components/Spirals/SpiralsBrowserGate.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";

const SpiralsSVGFallback = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "var(--color-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: -1,
    }}
  >
    <div style={{ color: "var(--color-text)" }}>Loading spirals...</div>
  </div>
);

export interface HomePageSpiralsLayerProps {
  configs: SpiralsConfig[];
  inView: boolean;
  initialized: boolean;
}

export const HomePageSpiralsLayer = memo(
  ({ configs, inView, initialized }: HomePageSpiralsLayerProps) => {
    if (!initialized) {
      return null;
    }

    return (
      <Suspense fallback={<SpiralsSVGFallback />}>
        <SpiralsBrowserGate>
          <SpiralsSVG
            key={new Date().toDateString()}
            visible={inView}
            configs={configs}
          />
        </SpiralsBrowserGate>
      </Suspense>
    );
  },
);

HomePageSpiralsLayer.displayName = "HomePageSpiralsLayer";

export default HomePageSpiralsLayer;

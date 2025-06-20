"use client";

import { lazy, Suspense, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import PageContainer from "src/components/PageContainer/Page.component";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import SpiralsActions from "src/components/Spirals/SpiralsActions";
import { SpiralsControls } from "src/components/Spirals/SpiralsControls.component";
import { useSpirals } from "src/contexts/SpiralsContext";
import { isBrowser } from "src/helpers/helpers";

// Lazy load the SpiralsSVG component for better performance
const SpiralsSVG = lazy(
  () => import("src/components/Spirals/SpiralsSVG.component"),
);

// Loading fallback component
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

export const HomePage = () => {
  const { state, dispatch } = useSpirals();
  const { configs, isPlaygroundOpen, clientReady } = state;

  const { inView, ref } = useInView({
    triggerOnce: true,
    initialInView: true,
    fallbackInView: true,
    // Add threshold to start loading earlier
    threshold: 0.1,
  });

  // Set client ready when in view
  useEffect(() => {
    if (isBrowser() && inView) {
      dispatch({ type: "SET_CLIENT_READY", payload: true });
    }
  }, [inView, dispatch]);

  // Memoize the action handlers to prevent unnecessary re-renders
  const actionHandlers = useMemo(
    () => ({
      togglePlayground: () => dispatch({ type: "TOGGLE_PLAYGROUND" }),
      randomizeAll: () => dispatch({ type: "RANDOMIZE_ALL" }),
      updateConfig: (config: SpiralsConfig, index: number) =>
        dispatch({ type: "UPDATE_CONFIG", payload: { config, index } }),
      addSpiralSet: () => dispatch({ type: "ADD_SPIRAL_SET" }),
      removeSpiralSet: (id: string) =>
        dispatch({ type: "REMOVE_SPIRAL_SET", payload: { id } }),
    }),
    [dispatch],
  );

  return (
    <>
      <PageContainer ref={ref}>
        <footer className="footer">
          <Bio />
          <div className="footerActions">
            <SpiralsActions
              onTogglePlayground={actionHandlers.togglePlayground}
              isPlaygroundOpen={isPlaygroundOpen}
              spiralConfigs={configs}
              onRandomizeAllAction={actionHandlers.randomizeAll}
            />
          </div>
        </footer>
      </PageContainer>

      {/* Always render the controls so the Playground button is always visible */}
      <SpiralsControls
        configs={configs}
        onConfigChangeAction={actionHandlers.updateConfig}
        onAddSpiralSetAction={actionHandlers.addSpiralSet}
        onRemoveSpiralSetAction={actionHandlers.removeSpiralSet}
        onRandomizeAllAction={actionHandlers.randomizeAll}
        isOpen={isPlaygroundOpen}
        onToggleAction={actionHandlers.togglePlayground}
      />

      {/* Render the SVG only when ready and in view with lazy loading */}
      {clientReady && (
        <Suspense fallback={<SpiralsSVGFallback />}>
          <SpiralsSVG
            key={new Date().toDateString()}
            visible={inView}
            configs={configs}
          />
        </Suspense>
      )}
    </>
  );
};

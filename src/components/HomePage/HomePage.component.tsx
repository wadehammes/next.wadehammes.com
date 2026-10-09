"use client";

import { type ReactNode, startTransition, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { HomePageSpiralsLayer } from "src/components/HomePage/HomePageSpiralsLayer.component";
import PageContainer from "src/components/PageContainer/Page.component";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { SpiralsActions } from "src/components/Spirals/SpiralsActions.component";
import { SpiralsControls } from "src/components/Spirals/SpiralsControls.component";
import {
  useSpiralsConfigs,
  useSpiralsDispatch,
  useSpiralsState,
} from "src/contexts/SpiralsContext";

export interface HomePageProps {
  bio?: ReactNode;
}

export const HomePage = ({ bio = null }: HomePageProps) => {
  const dispatch = useSpiralsDispatch();
  const configs = useSpiralsConfigs();
  const { isPlaygroundOpen, initialized } = useSpiralsState();

  const { inView, ref } = useInView({
    triggerOnce: true,
    initialInView: true,
    fallbackInView: true,
    threshold: 0.1,
  });

  const actionHandlers = useMemo(
    () => ({
      togglePlayground: () =>
        startTransition(() => dispatch({ type: "TOGGLE_PLAYGROUND" })),
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
      <PageContainer ref={ref} testId="rhHomePage">
        <footer className="footer">
          {bio}
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

      <SpiralsControls
        configs={configs}
        onConfigChangeAction={actionHandlers.updateConfig}
        onAddSpiralSetAction={actionHandlers.addSpiralSet}
        onRemoveSpiralSetAction={actionHandlers.removeSpiralSet}
        onRandomizeAllAction={actionHandlers.randomizeAll}
        isOpen={isPlaygroundOpen}
        onToggleAction={actionHandlers.togglePlayground}
      />

      <HomePageSpiralsLayer
        configs={configs}
        inView={inView}
        initialized={initialized}
      />
    </>
  );
};

export default HomePage;

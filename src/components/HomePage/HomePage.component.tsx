"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import PageContainer from "src/components/PageContainer/Page.component";
import {
  DEFAULT_CONFIG,
  generateRandomConfig,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import SpiralsActions from "src/components/Spirals/SpiralsActions";
import { SpiralsControls } from "src/components/Spirals/SpiralsControls.component";
import SpiralsSVG from "src/components/Spirals/SpiralsSVG.component";
import { isBrowser } from "src/helpers/helpers";

export const HomePage = () => {
  const [key] = useState<Date>(new Date());
  const [clientReady, setClientReady] = useState<boolean>(false);
  const [spiralConfigs, setSpiralConfigs] = useState<SpiralsConfig[]>([
    DEFAULT_CONFIG,
  ]); // Start with a single default config
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const { inView, ref } = useInView({
    triggerOnce: true,
    initialInView: true,
    fallbackInView: true,
  });

  // Initialize with random spiral sets on client only
  useEffect(() => {
    if (isBrowser()) {
      const initialSpiralCount = Math.floor(Math.random() * 4) + 2; // 2-5 sets
      const initialConfigs = Array.from({ length: initialSpiralCount }, () =>
        generateRandomConfig(),
      );
      setSpiralConfigs(initialConfigs);
    }
  }, []);

  useEffect(() => {
    if (isBrowser() && inView) {
      setClientReady(true);
    }
  }, [inView]);

  const handleConfigChange = (newConfig: SpiralsConfig, index: number) => {
    const updatedConfigs = [...spiralConfigs];
    updatedConfigs[index] = newConfig;
    setSpiralConfigs(updatedConfigs);
  };

  const handleAddSpiralSet = () => {
    const newConfig = generateRandomConfig();
    setSpiralConfigs([...spiralConfigs, newConfig]);
  };

  const handleRemoveSpiralSet = (index: number) => {
    if (spiralConfigs.length > 1) {
      const updatedConfigs = spiralConfigs.filter((_, i) => i !== index);
      setSpiralConfigs(updatedConfigs);
    }
  };

  const handleRandomizeAll = () => {
    const newConfigs = spiralConfigs.map(() => generateRandomConfig());
    setSpiralConfigs(newConfigs);
  };

  const handleTogglePlayground = () => {
    setIsPlaygroundOpen(!isPlaygroundOpen);
  };

  return (
    <>
      <PageContainer ref={ref}>
        <footer className="footer">
          <Bio />
          <div className="footerActions">
            <SpiralsActions
              onTogglePlayground={handleTogglePlayground}
              isPlaygroundOpen={isPlaygroundOpen}
              spiralConfigs={spiralConfigs}
            />
          </div>
        </footer>
      </PageContainer>

      {/* Always render the controls so the Playground button is always visible */}
      <SpiralsControls
        configs={spiralConfigs}
        onConfigChangeAction={handleConfigChange}
        onAddSpiralSetAction={handleAddSpiralSet}
        onRemoveSpiralSetAction={handleRemoveSpiralSet}
        onRandomizeAllAction={handleRandomizeAll}
        isOpen={isPlaygroundOpen}
        onToggleAction={handleTogglePlayground}
      />

      {/* Render the SVG only when ready and in view */}
      {clientReady && (
        <SpiralsSVG
          key={key.toDateString()}
          visible={inView}
          configs={spiralConfigs}
        />
      )}
    </>
  );
};

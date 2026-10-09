"use client";

import { useEffect, useMemo, useState } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
  sortConfigsForPaintOrder,
} from "src/components/Spirals/Spirals.utils";
import { SVG } from "src/components/SVG/SVG.component";

interface SpiralsSVGProps {
  visible: boolean;
  configs: SpiralsConfig[];
}

export const SpiralsSVG = ({ visible = false, configs }: SpiralsSVGProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const paintOrderedConfigs = useMemo((): SpiralsConfig[] => {
    if (configs.length === 0) {
      return [];
    }

    return sortConfigsForPaintOrder(configs);
  }, [configs]);

  const spiralElements = useMemo(
    () =>
      paintOrderedConfigs.map((config) => (
        <Spirals key={`spiral-config-${config.id}`} config={config} />
      )),
    [paintOrderedConfigs],
  );

  return (
    <SVG
      className="fractal"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      visible={visible && isLoaded}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {spiralElements}
    </SVG>
  );
};

export default SpiralsSVG;

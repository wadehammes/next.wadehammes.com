"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
  sortConfigsForPaintOrder,
} from "src/components/Spirals/Spirals.utils";
import { SpiralsSetLayer } from "src/components/Spirals/SpiralsSetLayer.component";
import styles from "src/components/Spirals/SpiralsSVG.module.css";
import { SVG } from "src/components/SVG/SVG.component";
import { preferSpiralsLayeredSvg } from "src/helpers/spiralsAnimation";

interface SpiralsSVGProps {
  visible: boolean;
  configs: SpiralsConfig[];
}

export const SpiralsSVG = ({ visible = false, configs }: SpiralsSVGProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const useLayeredSvg = preferSpiralsLayeredSvg();

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

  const stackVisible = visible && isLoaded;

  if (useLayeredSvg) {
    return (
      <div
        className={classNames(
          "fractal",
          styles.fractalStack,
          stackVisible && styles.visible,
        )}
        data-fractal-stack="true"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {paintOrderedConfigs.map((config, paintIndex) => (
          <SpiralsSetLayer
            key={`spiral-layer-${config.id}`}
            config={config}
            paintIndex={paintIndex}
          />
        ))}
      </div>
    );
  }

  return (
    <SVG
      className="fractal"
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      visible={stackVisible}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {paintOrderedConfigs.map((config) => (
        <Spirals key={`spiral-config-${config.id}`} config={config} />
      ))}
    </SVG>
  );
};

export default SpiralsSVG;

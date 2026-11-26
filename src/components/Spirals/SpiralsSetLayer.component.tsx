"use client";

import classNames from "classnames";
import { type CSSProperties, useMemo, useRef } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import spiralStyles from "src/components/Spirals/Spirals.module.css";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import styles from "src/components/Spirals/SpiralsSVG.module.css";
import { SVG } from "src/components/SVG/SVG.component";
import svgStyles from "src/components/SVG/SVG.module.css";
import {
  isSpiralsReducedMotionBrowser,
  preferCssSetRotation,
  shouldRunSpiralGsapAnimations,
} from "src/helpers/spiralsAnimation";

interface SpiralsSetLayerProps {
  config: SpiralsConfig;
  paintIndex: number;
}

export const SpiralsSetLayer = ({
  config,
  paintIndex,
}: SpiralsSetLayerProps) => {
  const randomDirectionRef = useRef<number>(Math.random() < 0.5 ? 1 : -1);
  const useCssSetMotion =
    preferCssSetRotation() && !isSpiralsReducedMotionBrowser();

  const setMotionStyle = useMemo(
    () =>
      ({
        "--spirals-set-duration": `${config.animationSpeed}ms`,
        "--spirals-set-scale": config.animationScale,
        zIndex: paintIndex,
        opacity: 1,
      }) as CSSProperties,
    [config.animationScale, config.animationSpeed, paintIndex],
  );

  return (
    <SVG
      className={classNames(
        "fractal-layer",
        styles.fractalLayer,
        svgStyles.svg,
        {
          [spiralStyles.spiralsSvgLayerCssMotion]: useCssSetMotion,
          [spiralStyles.spiralsSetCssMotionReverse]:
            useCssSetMotion && randomDirectionRef.current < 0,
          [spiralStyles.spiralsSvgLayerScaleIn]:
            !useCssSetMotion && !shouldRunSpiralGsapAnimations(),
        },
      )}
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      fadeWithVisibility={false}
      visible
      style={setMotionStyle}
    >
      <Spirals config={config} deferSetLevelMotion />
    </SVG>
  );
};

export default SpiralsSetLayer;

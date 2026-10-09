"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { Spiral } from "src/components/Spirals/Spiral.component";
import {
  SPIRALS_CONSTANTS as constant,
  resolveLightnessForTheme,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import { usePreferredTheme } from "src/hooks/usePreferredTheme";

const SPIRALS_SVG_ORIGIN = `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`;

interface SpiralsProps {
  config: SpiralsConfig;
}

export const Spirals = ({ config }: SpiralsProps) => {
  const { currentTheme } = usePreferredTheme();
  const spiralsRef = useRef<SVGGElement>(null);
  const randomDirectionRef = useRef<number>(Math.random() < 0.5 ? 1 : -1);
  const displayLightness = resolveLightnessForTheme(
    config.lightness,
    currentTheme,
  );

  const spirals = useMemo(() => {
    return [...new Array(config.spiralCount)].map((_, i) => {
      const spiralsOffset = (360 / config.spiralCount) * i;

      return (
        <Spiral
          angleOffset={spiralsOffset}
          fill={config.fill}
          strokeWidth={config.strokeWidth}
          offset={config.circleOffset}
          count={config.circleCount}
          l={displayLightness}
          c={config.chroma}
          h={config.hue}
          rad={config.elementSize}
          opacitySubtraction={config.opacitySubtraction}
          shape={config.shape}
          polygonSides={config.polygonSides}
          spiralSpacing={config.spiralSpacing}
          pulseEnabled={config.pulseEnabled}
          pulseSpeed={config.pulseSpeed}
          pulseIntensity={config.pulseIntensity}
          pulseOffset={config.pulseOffset}
          shapeSpinEnabled={config.shapeSpinEnabled}
          shapeSpinSpeed={config.shapeSpinSpeed}
          shapeSpinDirection={config.shapeSpinDirection}
          shapeSpinAlternate={config.shapeSpinAlternate}
          key={`spiral-${spiralsOffset}-${i}`}
        />
      );
    });
  }, [config, displayLightness]);

  useEffect(() => {
    const node = spiralsRef.current;
    if (!node) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(node, {
        rotation: 360 * randomDirectionRef.current,
        duration: config.animationSpeed / 1000,
        svgOrigin: SPIRALS_SVG_ORIGIN,
        smoothOrigin: true,
        repeat: -1,
        ease: "none",
        overwrite: "auto",
      });
      gsap.to(node, {
        scale: config.animationScale,
        duration: 0.8,
        svgOrigin: SPIRALS_SVG_ORIGIN,
        smoothOrigin: true,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    }, spiralsRef);

    return () => {
      ctx.revert();
    };
  }, [config.animationScale, config.animationSpeed]);

  return <g ref={spiralsRef}>{spirals}</g>;
};

export default Spirals;

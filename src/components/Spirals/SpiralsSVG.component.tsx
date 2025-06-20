"use client";

import { useEffect, useState } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import { SVG } from "src/components/SVG/SVG.component";

interface SpiralsSVGProps {
  visible: boolean;
  configs: SpiralsConfig[];
}

export const SpiralsSVG = ({ visible = false, configs }: SpiralsSVGProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger fade-in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure everything is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <SVG
      className="fractal"
      viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      visible={visible}
      style={{
        backgroundColor: "var(--color-bg)",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      {/* Render all spiral configurations in reverse order so newest appear on top */}
      {configs
        .slice()
        .reverse()
        .map((config) => (
          <Spirals key={`spiral-config-${config.id}`} config={config} />
        ))}
    </SVG>
  );
};

export default SpiralsSVG;

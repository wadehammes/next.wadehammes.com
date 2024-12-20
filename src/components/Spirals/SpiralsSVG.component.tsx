"use client";

import dynamic from "next/dynamic";
import type { FC } from "react";
import { SVG } from "src/components/SVG/SVG.component";
import { SPIRALS_CONSTANTS as constant } from "src/components/Spirals/Spirals.constants";
import { randomIntFromInterval } from "src/utils/helpers";

const Spirals = dynamic(
  () => import("src/components/Spirals/Spirals.component"),
);

interface SpiralsSVGProps {
  visible: boolean;
}

export const SpiralsSVG: FC<SpiralsSVGProps> = ({ visible = false }) => (
  <SVG
    className="fractal"
    viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
    visible={visible}
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <Spirals />
    <Spirals strokeWidth={0.5} fill={false} />
    <Spirals rad={2} circleOffset={200} />
    <Spirals
      circleOffset={5}
      fill={false}
      strokeWidth={randomIntFromInterval(3, 6)}
    />
    <Spirals strokeWidth={randomIntFromInterval(1, 8)} fill={false} />
    <Spirals strokeWidth={randomIntFromInterval(1, 2)} circleOffset={25} />
    <Spirals />
  </SVG>
);

export default SpiralsSVG;

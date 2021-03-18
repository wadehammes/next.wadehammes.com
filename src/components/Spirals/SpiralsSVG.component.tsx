import { FC } from "react";
import { SVG } from "src/components/SVG/SVG.component";
import { SPIRALS_CONSTANTS as constant } from "src/components/Spirals/Spirals.constants";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { randomIntFromInterval } from "src/utils/helpers";

export const SpiralsSVG: FC = () => (
  <SVG
    className="fractal"
    viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
  >
    <Spirals />
    <Spirals strokeWidth={0.5} fill={false} />
    <Spirals rad={2} />
    <Spirals rad={2} circleOffset={200} />
    <Spirals
      circleOffset={5}
      fill={false}
      strokeWidth={randomIntFromInterval(3, 6)}
    />
    <Spirals strokeWidth={randomIntFromInterval(1, 8)} fill={false} />
    <Spirals />
  </SVG>
);

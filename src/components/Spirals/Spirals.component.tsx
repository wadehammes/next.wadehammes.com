import { FC } from "react";
import { randomIntFromInterval } from "src/utils/helpers";
import { SPIRALS_VIEWBOX } from "src/utils/constants";

const degreesToRad = (1 * Math.PI) / 180;

interface SpiralProps {
  centerX?: number;
  centerY?: number;
  angleOffset?: number;
  fill?: boolean;
  strokeWidth?: number;
  number?: number;
  offset?: number;
  h?: number;
  s?: string;
  l?: string;
  rad?: number;
}

export const Spiral: FC<SpiralProps> = ({
  centerX = SPIRALS_VIEWBOX / 2,
  centerY = SPIRALS_VIEWBOX / 2,
  angleOffset = 0,
  fill = true,
  strokeWidth = 2,
  number = randomIntFromInterval(0, 20),
  offset = randomIntFromInterval(0, 100),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
  rad = randomIntFromInterval(0, 5),
}) => {
  const circles = [...new Array(number)].map((v, i) => {
    const angle = angleOffset * degreesToRad + i * ((Math.PI * 2) / number);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 2;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 2;
    const radius = rad + i;
    const opacity = 1 - 0.05 * i;

    return (
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill ? `hsla(${h},${s},${l},${opacity})` : "transparent"}
        stroke={`hsla(${h},${s},${l},${opacity})`}
        strokeWidth={strokeWidth}
        key={`circle-${i}`}
      />
    );
  });

  return <g>{circles}</g>;
};

interface SpiralsProps {
  fill?: boolean;
  strokeWidth?: number;
  number?: number;
  h?: number;
  s?: string;
  l?: string;
  rad?: number;
}

export const Spirals: FC<SpiralsProps> = ({
  fill = true,
  strokeWidth = 0,
  number = randomIntFromInterval(0, 8),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
  rad = randomIntFromInterval(0, 5),
}) => {
  const spirals = [...new Array(number)].map((v, i) => {
    const offset = (360 / number) * i;
    return (
      <Spiral
        angleOffset={offset}
        fill={fill}
        strokeWidth={
          !fill && strokeWidth
            ? randomIntFromInterval(0, strokeWidth)
            : strokeWidth
        }
        h={h}
        s={s}
        l={l}
        rad={rad}
        key={`spiral-${i}`}
      />
    );
  });

  return <g>{spirals}</g>;
};

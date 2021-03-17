import { FC } from "react";

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
}

export const Spiral: FC<SpiralProps> = ({
  centerX = 150,
  centerY = 150,
  angleOffset = 0,
  fill = true,
  strokeWidth = 2,
  number = Math.floor(Math.random() * 16),
  offset = Math.floor(Math.random() * 100),
  h = 30,
  s = "100%",
  l = "50%",
}) => {
  const circles = [...new Array(number)].map((v, i) => {
    const angle = angleOffset * degreesToRad + i * ((Math.PI * 3) / number);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 3;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 3;
    const radius = 2 + i;
    const opacity = 1 - 0.05 * i;

    return (
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill ? `hsla(${h},${s},${l},${opacity})` : "transparent"}
        stroke={`hsla(${h},${s},${l},${opacity})`}
        strokeWidth={strokeWidth}
        key={`circle_${i}`}
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
}

export const Spirals: FC<SpiralsProps> = ({
  fill = true,
  strokeWidth = 0,
  number = 5,
  h = 30,
  s = "100%",
  l = "50%",
}) => {
  const spirals = [...new Array(number)].map((v, i) => {
    const offset = (360 / number) * i;
    return (
      <Spiral
        angleOffset={offset}
        fill={fill}
        strokeWidth={strokeWidth}
        h={h}
        s={s}
        l={l}
        key={`spiral_${i}`}
      />
    );
  });

  return (
    <svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      {spirals}
    </svg>
  );
};

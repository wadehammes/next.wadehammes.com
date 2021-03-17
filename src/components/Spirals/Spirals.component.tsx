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
  rad?: number;
}

export const Spiral: FC<SpiralProps> = ({
  centerX = 125,
  centerY = 125,
  angleOffset = 0,
  fill = true,
  strokeWidth = 2,
  number = Math.floor(Math.random() * 20),
  offset = Math.floor(Math.random() * 100),
  h = Math.floor(Math.random() * 360),
  s = `${Math.floor(Math.random() * 100)}%`,
  l = `${Math.floor(Math.random() * 100)}%`,
  rad = Math.floor(Math.random() * 5),
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
  rad?: number;
}

export const Spirals: FC<SpiralsProps> = ({
  fill = true,
  strokeWidth = 0,
  number = 5,
  h = Math.floor(Math.random() * 360),
  s = `${Math.floor(Math.random() * 100)}%`,
  l = `${Math.floor(Math.random() * 100)}%`,
  rad = Math.floor(Math.random() * 5),
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
        rad={rad}
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

import { FC, useEffect, useRef } from "react";
import { randomIntFromInterval } from "src/utils/helpers";
import { SPIRALS_VIEWBOX } from "src/utils/constants";
import { gsap } from "gsap";

const degreesToRad = (1 * Math.PI) / 180;

interface SpiralProps {
  centerX?: number;
  centerY?: number;
  angleOffset?: number;
  fill?: boolean;
  strokeWidth?: number;
  count?: number;
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
  fill = Math.random() > 0.5,
  strokeWidth = randomIntFromInterval(0, 10),
  count = randomIntFromInterval(0, 10),
  offset = randomIntFromInterval(0, 100),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
  rad = randomIntFromInterval(0, 5),
}) => {
  const circles = [...new Array(count)].map((v, i) => {
    const angle = angleOffset * degreesToRad + i * ((Math.PI * 2) / count);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 2;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 2;
    const radius = rad + i;
    const opacity = 1 - 0.085 * i;

    return (
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill ? `hsla(${h},${s},${l},${opacity})` : "transparent"}
        stroke={`hsla(${h},${s},${l},${opacity})`}
        strokeWidth={!fill && strokeWidth ? strokeWidth : 0}
        key={`circle-${i}`}
      />
    );
  });

  return <g>{circles}</g>;
};

interface SpiralsProps {
  fill?: boolean;
  strokeWidth?: number;
  spiralCount?: number;
  circleCount?: number;
  circleOffset?: number;
  h?: number;
  s?: string;
  l?: string;
  rad?: number;
}

export const Spirals: FC<SpiralsProps> = ({
  fill = true,
  strokeWidth = 0,
  spiralCount = randomIntFromInterval(0, 8),
  circleOffset = randomIntFromInterval(0, 100),
  rad = randomIntFromInterval(0, 5),
  circleCount = randomIntFromInterval(0, 20),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
}) => {
  const spiralsRef = useRef<SVGGElement>(null);
  const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

  useEffect(() => {
    if (spiralsRef.current) {
      gsap.to(spiralsRef.current, {
        rotation: 360 * plusOrMinus,
        duration: randomIntFromInterval(50, 1000),
        svgOrigin: `${SPIRALS_VIEWBOX / 2} ${SPIRALS_VIEWBOX / 2}`,
        smoothOrigin: true,
        repeat: -1,
      });
    }
  }, [spiralsRef.current]);

  const spirals = [...new Array(spiralCount)].map((v, i) => {
    const offset = (360 / spiralCount) * i;
    return (
      <Spiral
        angleOffset={offset}
        fill={fill}
        strokeWidth={
          !fill && strokeWidth
            ? randomIntFromInterval(0, strokeWidth)
            : strokeWidth
        }
        offset={circleOffset}
        count={circleCount}
        h={h}
        s={s}
        l={l}
        rad={rad}
        key={`spiral-${i}`}
      />
    );
  });

  return <g ref={spiralsRef}>{spirals}</g>;
};

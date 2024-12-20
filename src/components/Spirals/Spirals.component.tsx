"use client";

import { gsap } from "gsap";
import { type FC, useEffect, useRef } from "react";
import { SPIRALS_CONSTANTS as constant } from "src/components/Spirals/Spirals.constants";
import { randomIntFromInterval } from "src/utils/helpers";

gsap.defaults({ transformPerspective: constant.VIEWBOX * 2 });

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
  centerX = constant.VIEWBOX / 2,
  centerY = constant.VIEWBOX / 2,
  angleOffset = 0,
  fill = Boolean(Math.random() > 0.5),
  strokeWidth = randomIntFromInterval(2, 12),
  count = randomIntFromInterval(12, 32),
  offset = randomIntFromInterval(50, 150),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
  rad = randomIntFromInterval(48, 64),
}) => {
  const circles = [...new Array(count)].map((_, i) => {
    const angle =
      angleOffset * constant.DEGREES_TO_RADIUS + i * ((Math.PI * 2) / count);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 2;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 2;
    const radius = rad + i;
    const opacity = 1 - constant.OPACITY_SUBTRACTION * i;

    return (
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill ? `hsla(${h},${s},${l},${opacity})` : "transparent"}
        stroke={`hsla(${h},${s},${l},${opacity})`}
        strokeWidth={!fill && strokeWidth ? strokeWidth : 0}
        // eslint-disable-next-line react/no-array-index-key
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
  fill = Boolean(Math.random() > 0.5),
  strokeWidth = 0,
  spiralCount = randomIntFromInterval(4, 12),
  circleOffset = randomIntFromInterval(20, 120),
  circleCount = randomIntFromInterval(6, 24),
  h = randomIntFromInterval(0, 360),
  s = `${randomIntFromInterval(0, 100)}%`,
  l = `${randomIntFromInterval(0, 100)}%`,
  rad = randomIntFromInterval(48, 64),
}) => {
  const spiralsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;

    if (spiralsRef.current) {
      const animate: GSAPAnimation = gsap.to(spiralsRef.current, {
        scale: 1,
        rotation: 360 * plusOrMinus,
        duration: randomIntFromInterval(250, 500),
        svgOrigin: `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`,
        smoothOrigin: true,
        repeat: -1,
        yoyo: true,
      });

      animate.play();
    }
  }, []);

  const spirals = [...new Array(spiralCount)].map((_, i) => {
    const spiralsOffset = (360 / spiralCount) * i;

    return (
      <Spiral
        angleOffset={spiralsOffset}
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
        // eslint-disable-next-line react/no-array-index-key
        key={`spiral-${i}`}
      />
    );
  });

  return <g ref={spiralsRef}>{spirals}</g>;
};

export default Spirals;

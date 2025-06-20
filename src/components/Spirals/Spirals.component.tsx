"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";

gsap.defaults({ transformPerspective: constant.VIEWBOX * 2 });

interface ShapeProps {
  cx: number;
  cy: number;
  radius: number;
  shape: "circle" | "square" | "triangle" | "polygon";
  polygonSides: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

const Shape = ({
  cx,
  cy,
  radius,
  shape,
  polygonSides,
  fill,
  stroke,
  strokeWidth,
}: ShapeProps) => {
  switch (shape) {
    case "circle":
      return (
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "square":
      return (
        <rect
          x={cx - radius}
          y={cy - radius}
          width={radius * 2}
          height={radius * 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );

    case "triangle": {
      const trianglePoints = [
        `${cx},${cy - radius}`,
        `${cx - radius * 0.866},${cy + radius * 0.5}`,
        `${cx + radius * 0.866},${cy + radius * 0.5}`,
      ].join(" ");
      return (
        <polygon
          points={trianglePoints}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case "polygon": {
      const points = [];
      for (let i = 0; i < polygonSides; i++) {
        const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x},${y}`);
      }
      return (
        <polygon
          points={points.join(" ")}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    default:
      return (
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
  }
};

interface SpiralProps {
  centerX?: number;
  centerY?: number;
  angleOffset?: number;
  fill?: boolean;
  strokeWidth?: number;
  count?: number;
  offset?: number;
  l?: number;
  c?: number;
  h?: number;
  rad?: number;
  opacitySubtraction?: number;
  shape?: "circle" | "square" | "triangle" | "polygon";
  polygonSides?: number;
}

export const Spiral = ({
  centerX = constant.VIEWBOX / 2,
  centerY = constant.VIEWBOX / 2,
  angleOffset = 0,
  fill = false,
  strokeWidth = 0,
  count = 12,
  offset = 50,
  l = 0.5,
  c = 0.2,
  h = 0,
  rad = 48,
  opacitySubtraction = constant.OPACITY_SUBTRACTION,
  shape = "circle",
  polygonSides = 6,
}: SpiralProps) => {
  const circles = [...new Array(count)].map((_, i) => {
    const angle =
      angleOffset * constant.DEGREES_TO_RADIANS + i * ((Math.PI * 2) / count);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 2;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 2;
    const radius = rad + i;
    const opacity = 1 - opacitySubtraction * i;

    return (
      <Shape
        key={`shape-${i}`}
        cx={x}
        cy={y}
        radius={radius}
        shape={shape}
        polygonSides={polygonSides}
        fill={fill ? `oklch(${l} ${c} ${h} / ${opacity})` : "transparent"}
        stroke={`oklch(${l} ${c} ${h} / ${opacity})`}
        strokeWidth={!fill && strokeWidth ? strokeWidth : 0}
      />
    );
  });

  return <g>{circles}</g>;
};

interface SpiralsProps {
  config: SpiralsConfig;
}

export const Spirals = ({ config }: SpiralsProps) => {
  const spiralsRef = useRef<SVGGElement>(null);
  const rotationAnimationRef = useRef<GSAPAnimation | null>(null);
  const scaleAnimationRef = useRef<GSAPAnimation | null>(null);
  const randomDirectionRef = useRef<number>(Math.random() < 0.5 ? 1 : -1);

  // Initialize rotation animation (only once)
  useEffect(() => {
    if (spiralsRef.current) {
      // Kill existing rotation animation if it exists
      if (rotationAnimationRef.current) {
        rotationAnimationRef.current.kill();
      }

      rotationAnimationRef.current = gsap.to(spiralsRef.current, {
        rotation: 360 * randomDirectionRef.current,
        duration: config.animationSpeed / 1000,
        svgOrigin: `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`,
        smoothOrigin: true,
        repeat: -1,
        yoyo: false,
        ease: "none",
      });
    }
  }, [config.animationSpeed]);

  // Handle scale changes smoothly
  useEffect(() => {
    if (spiralsRef.current) {
      // Kill existing scale animation if it exists
      if (scaleAnimationRef.current) {
        scaleAnimationRef.current.kill();
      }

      // Create smooth scale animation with bounce effect
      scaleAnimationRef.current = gsap.to(spiralsRef.current, {
        scale: config.animationScale,
        duration: 0.8, // Longer duration for more dramatic effect
        svgOrigin: `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`,
        smoothOrigin: true,
        ease: "back.out(1.7)", // Bounce effect for more dramatic scaling
      });
    }
  }, [config.animationScale]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (rotationAnimationRef.current) {
        rotationAnimationRef.current.kill();
      }
      if (scaleAnimationRef.current) {
        scaleAnimationRef.current.kill();
      }
    };
  }, []);

  const spirals = [...new Array(config.spiralCount)].map((_, i) => {
    const spiralsOffset = (360 / config.spiralCount) * i;

    return (
      <Spiral
        angleOffset={spiralsOffset}
        fill={config.fill}
        strokeWidth={config.strokeWidth}
        offset={config.circleOffset}
        count={config.circleCount}
        l={config.lightness}
        c={config.chroma}
        h={config.hue}
        rad={config.elementSize}
        opacitySubtraction={config.opacitySubtraction}
        shape={config.shape}
        polygonSides={config.polygonSides}
        key={`spiral-${spiralsOffset}-${i}`}
      />
    );
  });

  return <g ref={spiralsRef}>{spirals}</g>;
};

export default Spirals;

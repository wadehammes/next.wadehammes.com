"use client";

import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";

interface ShapeProps {
  cx: number;
  cy: number;
  radius: number;
  shape: "circle" | "square" | "triangle" | "polygon";
  polygonSides: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  onRef?: (ref: SVGElement | null) => void;
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
  onRef,
}: ShapeProps) => {
  // Memoize polygon points calculation
  const polygonPoints = useMemo(() => {
    if (shape !== "polygon") return "";
    const points = [];
    for (let i = 0; i < polygonSides; i++) {
      const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  }, [shape, polygonSides, cx, cy, radius]);

  switch (shape) {
    case "square": {
      const size = radius * 2;
      return (
        <rect
          ref={onRef}
          x={cx - radius}
          y={cy - radius}
          width={size}
          height={size}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case "triangle": {
      const trianglePoints = [
        `${cx},${cy - radius}`,
        `${cx - radius * 0.866},${cy + radius * 0.5}`,
        `${cx + radius * 0.866},${cy + radius * 0.5}`,
      ].join(" ");
      return (
        <polygon
          ref={onRef}
          points={trianglePoints}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    case "polygon": {
      return (
        <polygon
          ref={onRef}
          points={polygonPoints}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    }

    default:
      return (
        <circle
          ref={onRef}
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
  spiralSpacing?: number;
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
  spiralSpacing = 0.75,
}: SpiralProps) => {
  const shapeRefs = useRef<(SVGElement | null)[]>([]);
  const prevConfig = useRef({ count, offset, spiralSpacing, angleOffset, rad });

  // Memoize shape positions to avoid recalculating on every render
  const shapePositions = useMemo(() => {
    return [...new Array(count)].map((_, i) => {
      const angle =
        angleOffset * constant.DEGREES_TO_RADIANS + i * ((Math.PI * 2) / count);
      const distance = offset * (i + 1) * spiralSpacing;
      const x = centerX + Math.sin(angle) * distance;
      const y = centerY + Math.cos(angle) * distance;
      const radius = rad + i;
      const opacity = 1 - opacitySubtraction * i;

      return { x, y, radius, opacity };
    });
  }, [
    count,
    angleOffset,
    offset,
    spiralSpacing,
    centerX,
    centerY,
    rad,
    opacitySubtraction,
  ]);

  // Optimized config comparison without JSON.stringify
  const configChanged = useCallback(() => {
    const current = { count, offset, spiralSpacing, angleOffset, rad };
    const prev = prevConfig.current;
    return (
      current.count !== prev.count ||
      current.offset !== prev.offset ||
      current.spiralSpacing !== prev.spiralSpacing ||
      current.angleOffset !== prev.angleOffset ||
      current.rad !== prev.rad
    );
  }, [count, offset, spiralSpacing, angleOffset, rad]);

  // Only animate position/size, not color
  useEffect(() => {
    if (configChanged()) {
      shapeRefs.current.forEach((shapeRef, i) => {
        if (shapeRef && i < count) {
          const { x, y, radius } = shapePositions[i];
          gsap.to(shapeRef, {
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
            ...(shape === "circle" && {
              attr: { cx: x, cy: y, r: radius },
            }),
            ...(shape === "square" && {
              attr: {
                x: x - radius,
                y: y - radius,
                width: radius * 2,
                height: radius * 2,
              },
            }),
            ...(shape === "triangle" && {
              attr: {
                points: [
                  `${x},${y - radius}`,
                  `${x - radius * 0.866},${y + radius * 0.5}`,
                  `${x + radius * 0.866},${y + radius * 0.5}`,
                ].join(" "),
              },
            }),
            ...(shape === "polygon" && {
              attr: {
                points: (() => {
                  const points = [];
                  for (let j = 0; j < polygonSides; j++) {
                    const angle =
                      (j * 2 * Math.PI) / polygonSides - Math.PI / 2;
                    const px = x + radius * Math.cos(angle);
                    const py = y + radius * Math.sin(angle);
                    points.push(`${px},${py}`);
                  }
                  return points.join(" ");
                })(),
              },
            }),
          });
        }
      });
      prevConfig.current = { count, offset, spiralSpacing, angleOffset, rad };
    }
    // Only depend on position/size-related props
  }, [
    configChanged,
    count,
    shape,
    polygonSides,
    shapePositions,
    angleOffset,
    offset,
    spiralSpacing,
    rad,
  ]);

  const circles = shapePositions.map(({ x, y, radius, opacity }, i) => (
    <Shape
      key={`shape-${i}`}
      onRef={(ref) => {
        shapeRefs.current[i] = ref;
      }}
      cx={x}
      cy={y}
      radius={radius}
      shape={shape}
      polygonSides={polygonSides}
      fill={fill ? `oklch(${l} ${c} ${h} / ${opacity})` : "transparent"}
      stroke={`oklch(${l} ${c} ${h} / ${opacity})`}
      strokeWidth={!fill && strokeWidth ? strokeWidth : 0}
    />
  ));

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

  // Memoize spirals array to prevent unnecessary re-renders
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
          l={config.lightness}
          c={config.chroma}
          h={config.hue}
          rad={config.elementSize}
          opacitySubtraction={config.opacitySubtraction}
          shape={config.shape}
          polygonSides={config.polygonSides}
          spiralSpacing={config.spiralSpacing}
          key={`spiral-${spiralsOffset}-${i}`}
        />
      );
    });
  }, [
    config.spiralCount,
    config.fill,
    config.strokeWidth,
    config.circleOffset,
    config.circleCount,
    config.lightness,
    config.chroma,
    config.hue,
    config.elementSize,
    config.opacitySubtraction,
    config.shape,
    config.polygonSides,
    config.spiralSpacing,
  ]);

  // Initialize rotation animation (only once)
  useEffect(() => {
    if (spiralsRef.current) {
      // Kill existing rotation animation if it exists
      if (rotationAnimationRef.current) {
        rotationAnimationRef.current.kill();
      }

      // Create new rotation animation
      rotationAnimationRef.current = gsap.to(spiralsRef.current, {
        rotation: 360 * randomDirectionRef.current,
        duration: config.animationSpeed / 1000,
        svgOrigin: `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`,
        smoothOrigin: true,
        repeat: -1,
        yoyo: false,
        ease: "none",
        overwrite: "auto", // Allow overwriting to prevent conflicts
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
        overwrite: "auto", // Allow overwriting to prevent conflicts
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

  return <g ref={spiralsRef}>{spirals}</g>;
};

export default Spirals;

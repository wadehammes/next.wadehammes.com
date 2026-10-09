"use client";

import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Shape } from "src/components/Spirals/Shape.component";
import {
  SPIRALS_CONSTANTS as constant,
  getPolygonPoints,
  getTrianglePoints,
} from "src/components/Spirals/Spirals.utils";

export interface SpiralProps {
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
  pulseEnabled?: boolean;
  pulseSpeed?: number;
  pulseIntensity?: number;
  pulseOffset?: number;
  shapeSpinEnabled?: boolean;
  shapeSpinSpeed?: number;
  shapeSpinDirection?: 1 | -1;
  shapeSpinAlternate?: boolean;
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
  pulseEnabled = false,
  pulseSpeed = 1.5,
  pulseIntensity = 0.2,
  pulseOffset = 0,
  shapeSpinEnabled = true,
  shapeSpinSpeed = 12,
  shapeSpinDirection = 1,
  shapeSpinAlternate = true,
}: SpiralProps) => {
  const spiralGroupRef = useRef<SVGGElement>(null);
  const shapeRefs = useRef<(SVGElement | null)[]>([]);
  const prevConfig = useRef({
    count,
    offset,
    spiralSpacing,
    angleOffset,
    rad,
  });

  const registerShapeRef = useCallback(
    (index: number, node: SVGElement | null) => {
      shapeRefs.current[index] = node;
    },
    [],
  );

  const shapePositions = useMemo(() => {
    return [...new Array(count)].map((_, i) => {
      const angle =
        angleOffset * constant.DEGREES_TO_RADIANS + i * ((Math.PI * 2) / count);
      const distance =
        offset * (i + constant.RADIAL_INDEX_FACTOR) * spiralSpacing;
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

  useEffect(() => {
    const group = spiralGroupRef.current;
    if (!group) {
      return;
    }

    const current = { count, offset, spiralSpacing, angleOffset, rad };
    const prev = prevConfig.current;
    const layoutChanged =
      current.count !== prev.count ||
      current.offset !== prev.offset ||
      current.spiralSpacing !== prev.spiralSpacing ||
      current.angleOffset !== prev.angleOffset ||
      current.rad !== prev.rad;

    const maxPulsingShapes = Math.min(count, 10);
    const pulseInterval = Math.max(1, Math.floor(count / maxPulsingShapes));
    const maxSpinningShapes = Math.min(count, 12);
    const spinInterval = Math.max(1, Math.floor(count / maxSpinningShapes));
    const pulseAnimationDelay = 0.05;
    let pulseAnimationCount = 0;

    const ctx = gsap.context(() => {
      shapeRefs.current.forEach((shapeRef, i) => {
        if (!shapeRef || i >= count) {
          return;
        }

        const position = shapePositions[i];
        if (!position) {
          return;
        }

        const { x, y, radius } = position;
        const origin = `${x} ${y}`;

        if (layoutChanged) {
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
                points: getTrianglePoints(x, y, radius),
              },
            }),
            ...(shape === "polygon" && {
              attr: {
                points: getPolygonPoints(x, y, radius, polygonSides),
              },
            }),
          });
        }

        if (shapeSpinEnabled && i % spinInterval === 0) {
          const direction =
            shapeSpinDirection * (shapeSpinAlternate && i % 2 === 1 ? -1 : 1);

          gsap.to(shapeRef, {
            rotation: 360 * direction,
            duration: shapeSpinSpeed,
            ease: "none",
            repeat: -1,
            svgOrigin: origin,
            smoothOrigin: true,
            overwrite: "auto",
          });
        }

        if (pulseEnabled && i % pulseInterval === 0) {
          const shapePhaseOffset = (i / count) * Math.PI * 2 + pulseOffset;

          gsap.to(shapeRef, {
            scale: 1 + pulseIntensity,
            duration: pulseSpeed,
            ease: "power1.out",
            repeat: -1,
            yoyo: true,
            delay:
              (shapePhaseOffset / (Math.PI * 2)) * pulseSpeed +
              pulseAnimationCount * pulseAnimationDelay,
            overwrite: "auto",
            force3D: true,
            svgOrigin: origin,
            smoothOrigin: true,
          });

          pulseAnimationCount++;
        }
      });
    }, spiralGroupRef);

    if (layoutChanged) {
      prevConfig.current = current;
    }

    return () => {
      ctx.revert();
    };
  }, [
    count,
    shape,
    polygonSides,
    shapePositions,
    angleOffset,
    offset,
    spiralSpacing,
    rad,
    shapeSpinEnabled,
    shapeSpinSpeed,
    shapeSpinDirection,
    shapeSpinAlternate,
    pulseEnabled,
    pulseSpeed,
    pulseIntensity,
    pulseOffset,
  ]);

  const shapeElements = useMemo(() => {
    return shapePositions.map(({ x, y, radius, opacity }, i) => (
      <Shape
        key={`shape-${i}`}
        shapeIndex={i}
        registerShapeRef={registerShapeRef}
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
  }, [
    shapePositions,
    shape,
    polygonSides,
    fill,
    l,
    c,
    h,
    strokeWidth,
    registerShapeRef,
  ]);

  return <g ref={spiralGroupRef}>{shapeElements}</g>;
};

export default Spiral;

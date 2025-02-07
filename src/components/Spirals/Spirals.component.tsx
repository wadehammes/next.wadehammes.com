"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";

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
  opacitySubtraction?: number;
}

export const Spiral = ({
  centerX = constant.VIEWBOX / 2,
  centerY = constant.VIEWBOX / 2,
  angleOffset = 0,
  fill = false,
  strokeWidth = 0,
  count = 12,
  offset = 50,
  h = 0,
  s = "50%",
  l = "50%",
  rad = 48,
  opacitySubtraction = constant.OPACITY_SUBTRACTION,
}: SpiralProps) => {
  const circles = [...new Array(count)].map((_, i) => {
    const angle =
      angleOffset * constant.DEGREES_TO_RADIANS + i * ((Math.PI * 2) / count);
    const x = centerX + (Math.sin(angle) * (offset * i)) / 2;
    const y = centerY + (Math.cos(angle) * (offset * i)) / 2;
    const radius = rad + i;
    const opacity = 1 - opacitySubtraction * i;

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

      // Create smooth scale animation
      scaleAnimationRef.current = gsap.to(spiralsRef.current, {
        scale: config.animationScale,
        duration: 0.5, // Smooth transition duration
        svgOrigin: `${constant.VIEWBOX / 2} ${constant.VIEWBOX / 2}`,
        smoothOrigin: true,
        ease: "power2.out", // Smooth easing
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
        h={config.hue}
        s={`${config.saturation}%`}
        l={`${config.lightness}%`}
        rad={config.circleRadius}
        opacitySubtraction={config.opacitySubtraction}
        key={`spiral-${spiralsOffset}-${i}`}
      />
    );
  });

  return <g ref={spiralsRef}>{spirals}</g>;
};

export default Spirals;

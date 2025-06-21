"use client";

import { gsap } from "gsap";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  SPIRALS_CONSTANTS as constant,
  getPolygonPoints,
  getTrianglePoints,
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

// Memoize the Shape component to prevent unnecessary re-renders
const Shape = memo(
  ({
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
      return getPolygonPoints(cx, cy, radius, polygonSides);
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
        const trianglePoints = getTrianglePoints(cx, cy, radius);
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
  },
);

Shape.displayName = "Shape";

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
  pulseEnabled?: boolean;
  pulseSpeed?: number;
  pulseIntensity?: number;
  pulseOffset?: number;
}

// Memoize the Spiral component to prevent unnecessary re-renders
export const Spiral = memo(
  ({
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
  }: SpiralProps) => {
    const shapeRefs = useRef<(SVGElement | null)[]>([]);
    const pulseAnimationRefs = useRef<(GSAPAnimation | null)[]>([]);
    const prevConfig = useRef({
      count,
      offset,
      spiralSpacing,
      angleOffset,
      rad,
    });

    // Memoize shape positions to avoid recalculating on every render
    const shapePositions = useMemo(() => {
      return [...new Array(count)].map((_, i) => {
        const angle =
          angleOffset * constant.DEGREES_TO_RADIANS +
          i * ((Math.PI * 2) / count);
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

    // Pulse animation effect - Performance optimized
    useEffect(() => {
      if (!pulseEnabled) {
        // Kill all pulse animations if disabled
        pulseAnimationRefs.current.forEach((anim) => {
          if (anim) {
            anim.kill();
          }
        });
        pulseAnimationRefs.current = [];
        return;
      }

      // Performance optimization: Only animate a subset of shapes
      const maxPulsingShapes = Math.min(count, 10); // Increased from 6 to 10 for more visible effect
      const pulseInterval = Math.max(1, Math.floor(count / maxPulsingShapes));

      // Throttle animations to prevent overwhelming the GPU
      const animationDelay = 0.05; // Reduced from 0.1 to 0.05 for more immediate effect
      let animationCount = 0;

      // Performance monitoring: Track active animations
      const activeAnimations: GSAPAnimation[] = [];

      // Create pulse animations for selected shapes only
      shapeRefs.current.forEach((shapeRef, i) => {
        if (shapeRef && i < count && i % pulseInterval === 0) {
          // Kill existing pulse animation for this shape
          if (pulseAnimationRefs.current[i]) {
            pulseAnimationRefs.current[i]?.kill();
          }

          // Calculate phase offset for this shape to create wave effect
          const shapePhaseOffset = (i / count) * Math.PI * 2 + pulseOffset;

          // Create pulse animation with optimized settings and throttling
          const pulseAnim = gsap.to(shapeRef, {
            scale: 1 + pulseIntensity,
            duration: pulseSpeed,
            ease: "power1.out", // Changed from power2.inOut for more dramatic effect
            repeat: -1,
            yoyo: true,
            delay:
              (shapePhaseOffset / (Math.PI * 2)) * pulseSpeed +
              animationCount * animationDelay,
            overwrite: "auto",
            // Performance optimizations
            force3D: true, // Force hardware acceleration
            transformOrigin: "center center", // Optimize transform origin
          });

          pulseAnimationRefs.current[i] = pulseAnim;
          activeAnimations.push(pulseAnim);
          animationCount++;
        } else if (pulseAnimationRefs.current[i]) {
          // Kill animations for shapes that shouldn't pulse
          pulseAnimationRefs.current[i]?.kill();
          pulseAnimationRefs.current[i] = null;
        }
      });

      // Performance logging (only in development)
      if (
        process.env.NODE_ENV === "development" &&
        activeAnimations.length > 0
      ) {
        console.log(
          `🎯 Pulse Performance: ${activeAnimations.length} active animations for ${count} shapes`,
        );
      }

      // Cleanup function
      return () => {
        pulseAnimationRefs.current.forEach((anim) => {
          if (anim) {
            anim.kill();
          }
        });
        pulseAnimationRefs.current = [];
      };
    }, [pulseEnabled, pulseSpeed, pulseIntensity, pulseOffset, count]);

    // Memoize the shape elements to prevent unnecessary re-renders
    const shapeElements = useMemo(() => {
      return shapePositions.map(({ x, y, radius, opacity }, i) => (
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
    }, [shapePositions, shape, polygonSides, fill, l, c, h, strokeWidth]);

    return <g>{shapeElements}</g>;
  },
);

Spiral.displayName = "Spiral";

interface SpiralsProps {
  config: SpiralsConfig;
}

// Memoize the Spirals component to prevent unnecessary re-renders
export const Spirals = memo(({ config }: SpiralsProps) => {
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
          pulseEnabled={config.pulseEnabled}
          pulseSpeed={config.pulseSpeed}
          pulseIntensity={config.pulseIntensity}
          pulseOffset={config.pulseOffset}
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
    config.pulseEnabled,
    config.pulseSpeed,
    config.pulseIntensity,
    config.pulseOffset,
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
});

Spirals.displayName = "Spirals";

export default Spirals;

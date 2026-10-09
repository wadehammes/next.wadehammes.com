"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import {
  getPolygonPoints,
  getTrianglePoints,
} from "src/components/Spirals/Spirals.utils";

export interface ShapeProps {
  cx: number;
  cy: number;
  radius: number;
  shape: "circle" | "square" | "triangle" | "polygon";
  polygonSides: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  shapeIndex: number;
  registerShapeRef: (index: number, node: SVGElement | null) => void;
}

export const Shape = ({
  cx,
  cy,
  radius,
  shape,
  polygonSides,
  fill,
  stroke,
  strokeWidth,
  shapeIndex,
  registerShapeRef,
}: ShapeProps) => {
  const nodeRef = useRef<SVGElement | null>(null);

  const setShapeNode = useCallback((node: SVGElement | null) => {
    nodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    registerShapeRef(shapeIndex, nodeRef.current);
    return () => {
      registerShapeRef(shapeIndex, null);
    };
  }, [registerShapeRef, shapeIndex]);

  const polygonPoints =
    shape === "polygon" ? getPolygonPoints(cx, cy, radius, polygonSides) : "";

  switch (shape) {
    case "square": {
      const size = radius * 2;
      return (
        <rect
          ref={setShapeNode}
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
          ref={setShapeNode}
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
          ref={setShapeNode}
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
          ref={setShapeNode}
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

export default Shape;

import { describe, expect, it, jest } from "@jest/globals";
import { render } from "@testing-library/react";
import { Shape } from "src/components/Spirals/Shape.component";

describe("Shape", () => {
  it("registers and unregisters its SVG node with the parent", () => {
    const registerShapeRef = jest.fn();

    const { unmount } = render(
      <svg>
        <Shape
          cx={100}
          cy={100}
          fill="red"
          polygonSides={6}
          radius={10}
          registerShapeRef={registerShapeRef}
          shape="circle"
          shapeIndex={0}
          stroke="red"
          strokeWidth={0}
        />
      </svg>,
    );

    const registeredNode = registerShapeRef.mock.calls.find(
      ([index, node]) => index === 0 && node !== null,
    )?.[1] as SVGElement | undefined;

    expect(registeredNode?.tagName.toLowerCase()).toBe("circle");

    unmount();

    expect(registerShapeRef).toHaveBeenCalledWith(0, null);
  });
});

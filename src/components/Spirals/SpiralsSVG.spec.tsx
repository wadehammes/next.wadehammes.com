import { describe, expect, it } from "@jest/globals";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
import { preferSpiralsLayeredSvg } from "src/helpers/spiralsAnimation";
import { spiralsConfigFactory } from "src/tests/factories/SpiralsConfig.factory";
import { render, screen } from "test-utils";

jest.mock("src/helpers/spiralsAnimation", () => {
  const actual = jest.requireActual(
    "src/helpers/spiralsAnimation",
  ) as typeof import("src/helpers/spiralsAnimation");
  return {
    ...actual,
    preferSpiralsLayeredSvg: jest.fn(() => false),
  };
});

jest.mock("src/components/Spirals/Spirals.component", () => ({
  Spirals: ({ config }: { config: { id: string } }) => (
    <g data-testid={`spiral-set-${config.id}`} />
  ),
}));

describe("SpiralsSVG", () => {
  it("paints larger-scale sets behind smaller ones in the DOM", () => {
    const configs = [
      spiralsConfigFactory.build({ id: "small", animationScale: 1.05 }),
      spiralsConfigFactory.build({ id: "large", animationScale: 1.65 }),
      spiralsConfigFactory.build({ id: "medium", animationScale: 1.3 }),
    ];

    const { container } = render(<SpiralsSVG visible configs={configs} />);

    const painted = [
      ...container.querySelectorAll("[data-testid^='spiral-set-']"),
    ];
    expect(painted.map((node) => node.getAttribute("data-testid"))).toEqual([
      "spiral-set-large",
      "spiral-set-medium",
      "spiral-set-small",
    ]);
  });

  it("renders all configs when visible (no batching)", () => {
    const configs = [
      spiralsConfigFactory.build({ id: "a" }),
      spiralsConfigFactory.build({ id: "b" }),
      spiralsConfigFactory.build({ id: "c" }),
      spiralsConfigFactory.build({ id: "d" }),
    ];

    render(<SpiralsSVG visible configs={configs} />);

    expect(screen.getByTestId("spiral-set-d")).toBeInTheDocument();
    expect(screen.getByTestId("spiral-set-c")).toBeInTheDocument();
    expect(screen.getByTestId("spiral-set-b")).toBeInTheDocument();
    expect(screen.getByTestId("spiral-set-a")).toBeInTheDocument();
  });

  it("keeps spiral sets mounted when not visible", () => {
    const configs = [spiralsConfigFactory.build({ id: "hidden" })];

    const { container } = render(
      <SpiralsSVG visible={false} configs={configs} />,
    );

    expect(screen.getByTestId("spiral-set-hidden")).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("uses one svg per set when layered svg is preferred", () => {
    jest.mocked(preferSpiralsLayeredSvg).mockReturnValue(true);
    const configs = [
      spiralsConfigFactory.build({ id: "a" }),
      spiralsConfigFactory.build({ id: "b" }),
    ];

    const { container } = render(<SpiralsSVG visible configs={configs} />);

    expect(container.querySelector('[data-fractal-stack="true"]')).toBeTruthy();
    expect(container.querySelectorAll("svg.fractal-layer")).toHaveLength(2);
    jest.mocked(preferSpiralsLayeredSvg).mockReturnValue(false);
  });
});

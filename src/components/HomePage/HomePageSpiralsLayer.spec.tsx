import { describe, expect, it } from "@jest/globals";
import { HomePageSpiralsLayer } from "src/components/HomePage/HomePageSpiralsLayer.component";
import { spiralsConfigFactory } from "src/tests/factories/SpiralsConfig.factory";
import { render, screen } from "test-utils";

jest.mock("src/components/Spirals/SpiralsBrowserGate.component", () => ({
  SpiralsBrowserGate: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="rhSpiralsBrowserGate">{children}</div>
  ),
}));

jest.mock("src/components/Spirals/SpiralsSVG.component", () => ({
  SpiralsSVG: () => <div data-testid="rhSpiralsSVG" />,
}));

describe("HomePageSpiralsLayer", () => {
  it("does not mount spirals until initialized", () => {
    render(
      <HomePageSpiralsLayer
        configs={[spiralsConfigFactory.build()]}
        inView
        initialized={false}
      />,
    );

    expect(screen.queryByTestId("rhSpiralsSVG")).not.toBeInTheDocument();
  });

  it("mounts spirals when initialized and in view", () => {
    render(
      <HomePageSpiralsLayer
        configs={[spiralsConfigFactory.build()]}
        inView
        initialized
      />,
    );

    expect(screen.getByTestId("rhSpiralsSVG")).toBeInTheDocument();
  });
});

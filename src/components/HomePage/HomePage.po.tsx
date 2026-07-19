import type { ComponentProps } from "react";
import { HomePage } from "src/components/HomePage/HomePage.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { homeDocumentFactory } from "src/tests/factories/HomeDocument.factory";
import { richTextFactory } from "src/tests/factories/RichText.factory";
import { render } from "test-utils";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    inView: false,
    ref: jest.fn(),
  }),
}));

jest.mock("@prismicio/react");

jest.mock("src/components/Spirals/SpiralsSVG.component", () => ({
  __esModule: true,
  default: () => <div data-testid="rhSpiralsSVG" />,
}));

export class HomePagePageObject extends BasePageObject {
  testId = "rhHomePage";

  renderHomePage(props: ComponentProps<typeof HomePage> = {}) {
    return render(<HomePage {...props} />);
  }

  buildHomePage() {
    return homeDocumentFactory.buildParsedPage();
  }

  buildHomePageWithoutCopy() {
    return homeDocumentFactory.buildParsedPage({}, { copy: null });
  }

  buildHomePageWithHeading(text: string) {
    return homeDocumentFactory.buildParsedPage(
      {},
      { copy: richTextFactory.buildHeading(text) },
    );
  }
}

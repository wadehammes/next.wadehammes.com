import type { ComponentProps } from "react";
import { Bio } from "src/components/Bio/Bio.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { richTextFactory } from "src/tests/factories/RichText.factory";
import { render } from "test-utils";

jest.mock("@prismicio/react");

export class BioPageObject extends BasePageObject {
  testId = "rhBio";

  renderBio(props: ComponentProps<typeof Bio> = {}) {
    return render(<Bio {...props} />);
  }

  buildCopy() {
    return richTextFactory.build();
  }

  buildEmptyCopy() {
    return richTextFactory.buildEmpty();
  }
}

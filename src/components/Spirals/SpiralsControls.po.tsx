import type { ComponentProps } from "react";
import { SpiralsControls } from "src/components/Spirals/SpiralsControls.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { spiralsConfigFactory } from "src/tests/factories/SpiralsConfig.factory";
import { saveSvg } from "src/utils/helpers";
import { render } from "test-utils";

jest.mock("src/utils/helpers");

export const mockedSaveSvg = saveSvg as jest.MockedFunction<typeof saveSvg>;

export class SpiralsControlsPageObject extends BasePageObject {
  testId = "rhSpiralsControls";

  buildDefaultProps(): ComponentProps<typeof SpiralsControls> {
    return {
      configs: [spiralsConfigFactory.build({ name: "Test Set" })],
      isOpen: true,
      onAddSpiralSetAction: jest.fn(),
      onConfigChangeAction: jest.fn(),
      onRandomizeAllAction: jest.fn(),
      onRemoveSpiralSetAction: jest.fn(),
      onToggleAction: jest.fn(),
    };
  }

  renderSpiralsControls(
    props: Partial<ComponentProps<typeof SpiralsControls>> = {},
  ) {
    return render(<SpiralsControls {...this.buildDefaultProps()} {...props} />);
  }
}

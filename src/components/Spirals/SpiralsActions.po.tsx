import type { ComponentProps } from "react";
import { SpiralsActions } from "src/components/Spirals/SpiralsActions.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { spiralsConfigFactory } from "src/tests/factories/SpiralsConfig.factory";
import { saveSvg } from "src/utils/helpers";
import { render } from "test-utils";

jest.mock("src/utils/helpers");

export const mockedSaveSvg = saveSvg as jest.MockedFunction<typeof saveSvg>;

export class SpiralsActionsPageObject extends BasePageObject {
  testId = "rhSpiralsActions";

  renderSpiralsActions(props: ComponentProps<typeof SpiralsActions> = {}) {
    return render(<SpiralsActions {...props} />);
  }

  buildConfigs() {
    return [
      spiralsConfigFactory.build({ name: "Cool Filled" }),
      spiralsConfigFactory.build({ name: "Deep Outline" }),
    ];
  }
}

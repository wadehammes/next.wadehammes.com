import type { ComponentProps } from "react";
import { Button } from "src/components/Button/Button.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "test-utils";

export class ButtonPageObject extends BasePageObject {
  testId = "rhButton";

  renderButton(props: ComponentProps<typeof Button> = {}) {
    return render(<Button {...props} />);
  }
}

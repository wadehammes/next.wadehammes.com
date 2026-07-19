import { Header } from "src/components/Header/Header.component";
import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "test-utils";

export class HeaderPageObject extends BasePageObject {
  testId = "rhHeader";

  renderHeader() {
    return render(<Header />);
  }
}

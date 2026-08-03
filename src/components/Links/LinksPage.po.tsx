import { LinksPage } from "src/components/Links/LinksPage.component";
import { SITE_EMAIL } from "src/constants/site";
import { buildGravatarUrl } from "src/helpers/gravatar";
import { BasePageObject } from "src/tests/basePageObject.po";
import { linksDocumentFactory } from "src/tests/factories/LinksDocument.factory";
import { type RenderResult, render } from "test-utils";

jest.mock("next/image");

export class LinksPagePageObject extends BasePageObject {
  testId = "rhLinksPage";

  renderLinksPage(
    props: {
      linksPage?: ReturnType<
        typeof linksDocumentFactory.buildParsedPage
      > | null;
    } = {},
  ): RenderResult {
    return render(
      <LinksPage
        fallbackAvatarUrl={buildGravatarUrl(SITE_EMAIL)}
        linksPage={
          props.linksPage === undefined
            ? linksDocumentFactory.buildParsedPage()
            : props.linksPage
        }
      />,
    );
  }
}

export const linksPagePageObject = new LinksPagePageObject();

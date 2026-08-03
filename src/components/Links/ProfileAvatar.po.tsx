import type { ComponentProps } from "react";
import { ProfileAvatar } from "src/components/Links/ProfileAvatar.component";
import { SITE_EMAIL } from "src/constants/site";
import { buildGravatarUrl } from "src/helpers/gravatar";
import { BasePageObject } from "src/tests/basePageObject.po";
import { render } from "test-utils";

jest.mock("next/image");

export class ProfileAvatarPageObject extends BasePageObject {
  testId = "rhProfileAvatarPlaceholder";

  renderProfileAvatar(
    props: Partial<ComponentProps<typeof ProfileAvatar>> = {},
  ) {
    const { fallbackAvatarUrl, name = "Wade Hammes", ...rest } = props;

    return render(
      <ProfileAvatar
        {...rest}
        fallbackAvatarUrl={fallbackAvatarUrl ?? buildGravatarUrl(SITE_EMAIL)}
        name={name}
      />,
    );
  }
}

export const profileAvatarPageObject = new ProfileAvatarPageObject();

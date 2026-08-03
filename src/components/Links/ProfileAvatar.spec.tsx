import { describe, expect, it } from "@jest/globals";
import { profileAvatarPageObject } from "src/components/Links/ProfileAvatar.po";
import { SITE_EMAIL } from "src/constants/site";
import { buildGravatarUrl } from "src/helpers/gravatar";
import { fireEvent, screen } from "test-utils";

describe("ProfileAvatar", () => {
  it("renders a Prismic profile image when one is provided", () => {
    profileAvatarPageObject.renderProfileAvatar({
      image: {
        url: "https://images.prismic.io/wadehammes/profile.png",
        width: 200,
        height: 200,
      },
    });

    expect(screen.getByRole("img", { name: "Wade Hammes" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/wadehammes/profile.png",
    );
    expect(
      screen.queryByTestId("rhProfileAvatarPlaceholder"),
    ).not.toBeInTheDocument();
  });

  it("falls back to Gravatar when Prismic has no profile image", () => {
    profileAvatarPageObject.renderProfileAvatar({ image: null });

    expect(screen.getByRole("img", { name: "Wade Hammes" })).toHaveAttribute(
      "src",
      buildGravatarUrl(SITE_EMAIL),
    );
  });

  it("shows the placeholder when the Gravatar image fails to load", () => {
    profileAvatarPageObject.renderProfileAvatar({ image: null });

    fireEvent.error(screen.getByRole("img", { name: "Wade Hammes" }));

    expect(
      screen.getByTestId("rhProfileAvatarPlaceholder"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "Wade Hammes" }),
    ).not.toBeInTheDocument();
  });
});

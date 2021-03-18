import { useRouter } from "next/dist/client/router";
import { FC } from "react";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { saveSvg } from "src/utils/helpers";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { A, P } from "src/components/Typography";

export const SpiralsAbout: FC = () => {
  const { replace } = useRouter();

  return (
    <>
      <P>
        The background you see currently was randomly generated with javascript
        and animated with <A href="https://greensock.com/gsap/">GSAP</A>. No two
        will ever be the same. Keep refreshing, download one you love.
      </P>
      <ButtonGroup>
        <Button
          variant={ButtonVariants.Primary}
          handleClick={() => saveSvg(".fractal", "background.svg")}
        >
          <DownloadIcon />
          Download SVG
        </Button>
        <Button
          variant={ButtonVariants.Text}
          handleClick={() => replace(window.location.href)}
          className="refresh"
        >
          Refresh
        </Button>
      </ButtonGroup>
    </>
  );
};

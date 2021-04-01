import { FC } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/dist/client/router";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { saveSvg } from "src/utils/helpers";
import { ButtonVariants } from "src/components/Button/Button.interfaces";

import { A, P } from "src/components/Typography";

const Button = dynamic(() => import("src/components/Button/Button.component"));

const ButtonGroup = dynamic(() =>
  import("src/components/Button/ButtonGroup.component"),
);

export const SpiralsAbout: FC = () => {
  const { replace } = useRouter();

  return (
    <>
      <P>
        The background you see currently was{" "}
        <A href="https://github.com/wadehammes/next.wadehammes.com/blob/staging/src/components/Spirals/Spirals.component.tsx">
          randomly generated with javascript
        </A>{" "}
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
          Regenerate
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SpiralsAbout;

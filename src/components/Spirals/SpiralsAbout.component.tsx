import parse from "html-react-parser";
import { useRouter } from "next/dist/client/router";
import { FC } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { P } from "src/components/Typography";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { saveSvg } from "src/utils/helpers";

export const SpiralsAbout: FC = () => {
  const { replace } = useRouter();

  return (
    <>
      <P>
        The animated background you see was{" "}
        <a href="https://github.com/wadehammes/next.wadehammes.com/blob/staging/src/components/Spirals/Spirals.component.tsx">
          randomly generated using SVG and Javascript
        </a>
        . Like us as people, no two will be the same and each unique in{" "}
        {parse("it&apos;s")} own way.
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

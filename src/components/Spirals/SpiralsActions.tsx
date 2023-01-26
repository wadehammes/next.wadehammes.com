import { useRouter } from "next/dist/client/router";
import { FC } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { Info } from "src/styles/icons/info";
import { Refresh } from "src/styles/icons/refresh";
import { saveSvg } from "src/utils/helpers";

export const SpiralsActions: FC = () => {
  const { replace } = useRouter();

  return (
    <ButtonGroup>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="Download SVG"
        handleClick={() => saveSvg(".fractal", "background.svg")}
      >
        <DownloadIcon />
      </Button>
      <Button
        variant={ButtonVariants.Text}
        handleClick={() => replace(window.location.href)}
        hasTooltip
        ariaLabel="Refresh SVG"
        className="refresh"
      >
        <Refresh />
      </Button>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="Download or refresh the generated SVG you see in the background."
      >
        <Info />
      </Button>
    </ButtonGroup>
  );
};

export default SpiralsActions;

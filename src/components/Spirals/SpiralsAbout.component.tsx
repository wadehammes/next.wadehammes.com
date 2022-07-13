import { useRouter } from "next/dist/client/router";
import { FC } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { saveSvg } from "src/utils/helpers";

export const SpiralsAbout: FC = () => {
  const { replace } = useRouter();

  return (
    <ButtonGroup>
      <Button
        variant={ButtonVariants.Primary}
        handleClick={() => saveSvg(".fractal", "background.svg")}
      >
        <DownloadIcon />
        Download background
      </Button>
      <Button
        variant={ButtonVariants.Text}
        handleClick={() => replace(window.location.href)}
        className="refresh"
      >
        Regenerate
      </Button>
    </ButtonGroup>
  );
};

export default SpiralsAbout;

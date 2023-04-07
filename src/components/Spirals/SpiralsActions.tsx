import { FC } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { Refresh } from "src/styles/icons/refresh";
import { saveSvg } from "src/utils/helpers";

interface SpiralsActionsProps {
  handleClick: (date: Date) => void;
}

export const SpiralsActions: FC<SpiralsActionsProps> = ({ handleClick }) => (
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
      handleClick={() => handleClick(new Date())}
      hasTooltip
      ariaLabel="Refresh SVG"
      className="refresh"
    >
      <Refresh />
    </Button>
  </ButtonGroup>
);

export default SpiralsActions;

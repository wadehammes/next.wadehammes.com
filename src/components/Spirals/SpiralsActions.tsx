import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { generateSpiralFileName } from "src/components/Spirals/Spirals.utils";
import DownloadIcon from "src/styles/icons/download.svg";
import Gamepad from "src/styles/icons/gamepad.svg";
import RefreshIcon from "src/styles/icons/refresh.svg";
import { saveSvg } from "src/utils/helpers";

interface SpiralsActionsProps {
  onTogglePlayground?: () => void;
  isPlaygroundOpen?: boolean;
  spiralConfigs?: SpiralsConfig[];
  onRandomizeAllAction?: () => void;
}

export const SpiralsActions = ({
  onTogglePlayground,
  isPlaygroundOpen = false,
  spiralConfigs = [],
  onRandomizeAllAction,
}: SpiralsActionsProps) => {
  // Hide the actions when the panel is open
  if (isPlaygroundOpen) {
    return null;
  }

  return (
    <ButtonGroup>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="Controls"
        handleClick={onTogglePlayground}
      >
        <Gamepad />
      </Button>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="New Spirals"
        handleClick={onRandomizeAllAction}
      >
        <RefreshIcon />
      </Button>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="Download SVG"
        handleClick={() =>
          saveSvg(".fractal", generateSpiralFileName(spiralConfigs))
        }
      >
        <DownloadIcon />
      </Button>
    </ButtonGroup>
  );
};

export default SpiralsActions;

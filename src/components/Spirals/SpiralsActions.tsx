import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { Themes, usePreferredTheme } from "src/hooks/usePreferredTheme";
import DownloadIcon from "src/styles/icons/download.svg";
import Gamepad from "src/styles/icons/gamepad.svg";
import Moon from "src/styles/icons/moon.svg";
import Sun from "src/styles/icons/sun.svg";
import { saveSvg } from "src/utils/helpers";

interface SpiralsActionsProps {
  onTogglePlayground?: () => void;
  isPlaygroundOpen?: boolean;
  spiralConfigs?: SpiralsConfig[];
}

export const SpiralsActions = ({
  onTogglePlayground,
  isPlaygroundOpen = false,
  spiralConfigs = [],
}: SpiralsActionsProps) => {
  const { currentTheme, updateTheme } = usePreferredTheme();

  // Hide the actions when the panel is open
  if (isPlaygroundOpen) {
    return null;
  }

  const generateFileName = () => {
    if (spiralConfigs.length === 0) {
      return "spirals.svg";
    }

    if (spiralConfigs.length === 1) {
      const name = spiralConfigs[0]?.name || "spiral";
      return `${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    }

    // For multiple sets, create a combined name
    const names = spiralConfigs.map((config) =>
      (config?.name || "spiral").toLowerCase().replace(/\s+/g, "-"),
    );
    return `${names.join("-")}.svg`;
  };

  return (
    <ButtonGroup>
      <Button
        variant={ButtonVariants.Text}
        hasTooltip
        ariaLabel="Download SVG"
        handleClick={() => saveSvg(".fractal", generateFileName())}
      >
        <DownloadIcon />
      </Button>
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
        ariaLabel={currentTheme === Themes.Light ? "Dark mode" : "Light mode"}
        className="theme"
        handleClick={() =>
          updateTheme(
            currentTheme === Themes.Light ? Themes.Dark : Themes.Light,
          )
        }
      >
        {currentTheme === Themes.Light ? <Moon /> : <Sun />}
      </Button>
    </ButtonGroup>
  );
};

export default SpiralsActions;

import { FC } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { Themes, usePreferredTheme } from "src/hooks/usePreferredTheme";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { Moon } from "src/styles/icons/moon";
import { Refresh } from "src/styles/icons/refresh";
import { Sun } from "src/styles/icons/sun";
import { saveSvg } from "src/utils/helpers";

interface SpiralsActionsProps {
  handleClick: (date: Date) => void;
}

export const SpiralsActions: FC<SpiralsActionsProps> = ({ handleClick }) => {
  const { currentTheme, updateTheme } = usePreferredTheme();

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
      handleClick={() => handleClick(new Date())}
      hasTooltip
      ariaLabel="Refresh SVG"
      className="refresh"
    >
      <Refresh />
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
)};

export default SpiralsActions;

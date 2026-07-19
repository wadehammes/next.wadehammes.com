"use client";

import type { ReactNode } from "react";
import { Button } from "src/components/Button/Button.component";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { generateSpiralFileName } from "src/components/Spirals/Spirals.utils";
import styles from "src/components/Spirals/SpiralsActions.module.css";
import { Themes, usePreferredTheme } from "src/hooks/usePreferredTheme";
import DownloadIcon from "src/styles/icons/download.svg";
import Gamepad from "src/styles/icons/gamepad.svg";
import Moon from "src/styles/icons/moon.svg";
import RefreshIcon from "src/styles/icons/refresh.svg";
import Sun from "src/styles/icons/sun.svg";
import { saveSvg } from "src/utils/helpers";

interface SpiralsActionsProps {
  onTogglePlayground?: () => void;
  isPlaygroundOpen?: boolean;
  spiralConfigs?: SpiralsConfig[];
  onRandomizeAllAction?: () => void;
}

interface SpiralsActionButtonProps {
  ariaLabel: string;
  handleClick?: () => void;
  children: ReactNode;
}

const SpiralsActionButton = ({
  ariaLabel,
  handleClick,
  children,
}: SpiralsActionButtonProps) => (
  <div className={styles.actionItem}>
    <Button
      variant={ButtonVariants.Text}
      ariaLabel={ariaLabel}
      handleClick={handleClick}
    >
      {children}
    </Button>
    <span className={styles.tooltip}>{ariaLabel}</span>
  </div>
);

export const SpiralsActions = ({
  onTogglePlayground,
  isPlaygroundOpen = false,
  spiralConfigs = [],
  onRandomizeAllAction,
}: SpiralsActionsProps) => {
  const { currentTheme, updateTheme } = usePreferredTheme();

  if (isPlaygroundOpen) {
    return null;
  }

  const themeLabel = currentTheme === Themes.Light ? "Dark mode" : "Light mode";

  return (
    <div data-testid="rhSpiralsActions">
      <ButtonGroup className={styles.actionsGroup}>
        <SpiralsActionButton
          ariaLabel="Controls"
          handleClick={onTogglePlayground}
        >
          <Gamepad />
        </SpiralsActionButton>
        <SpiralsActionButton
          ariaLabel="New Spirals"
          handleClick={onRandomizeAllAction}
        >
          <RefreshIcon />
        </SpiralsActionButton>
        <SpiralsActionButton
          ariaLabel="Download SVG"
          handleClick={() =>
            saveSvg(".fractal", generateSpiralFileName(spiralConfigs))
          }
        >
          <DownloadIcon />
        </SpiralsActionButton>
        <SpiralsActionButton
          ariaLabel={themeLabel}
          handleClick={() =>
            updateTheme(
              currentTheme === Themes.Light ? Themes.Dark : Themes.Light,
            )
          }
        >
          {currentTheme === Themes.Light ? <Moon /> : <Sun />}
        </SpiralsActionButton>
      </ButtonGroup>
    </div>
  );
};

export default SpiralsActions;

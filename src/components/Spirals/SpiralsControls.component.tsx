"use client";

import { useEffect, useState } from "react";
import {
  hexToHsl,
  hslToHex,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import styles from "src/components/Spirals/SpiralsControls.module.css";
import { saveSvg } from "src/utils/helpers";

interface SpiralsControlsProps {
  configs: SpiralsConfig[];
  onConfigChangeAction: (config: SpiralsConfig, index: number) => void;
  onAddSpiralSetAction: () => void;
  onRemoveSpiralSetAction: (index: number) => void;
  onRandomizeAllAction: () => void;
  isOpen: boolean;
  onToggleAction: () => void;
}

export const SpiralsControls = ({
  configs,
  onConfigChangeAction,
  onAddSpiralSetAction,
  onRemoveSpiralSetAction,
  onRandomizeAllAction,
  isOpen,
  onToggleAction,
}: SpiralsControlsProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Handle transitions when panel opens/closes
  useEffect(() => {
    // Only trigger transition if the open state actually changed
    if (prevIsOpen !== isOpen) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match the CSS transition duration
      setPrevIsOpen(isOpen);
      return () => clearTimeout(timer);
    }
  }, [isOpen, prevIsOpen]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onToggleAction();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onToggleAction();
    }
  };

  const generateFileName = () => {
    if (configs.length === 0) {
      return "spirals.svg";
    }

    if (configs.length === 1) {
      const name = configs[0]?.name || "spiral";
      return `${name.toLowerCase().replace(/\s+/g, "-")}.svg`;
    }

    // For multiple sets, create a combined name
    const names = configs.map((config) =>
      (config?.name || "spiral").toLowerCase().replace(/\s+/g, "-"),
    );
    return `${names.join("-")}.svg`;
  };

  return (
    <div
      className={styles.controlsContainer}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Spiral controls panel"
      tabIndex={-1}
    >
      {/* Slide-out Panel */}
      <div
        className={`${styles.panel} ${isOpen ? styles.open : ""} ${isTransitioning ? styles.transitioning : ""}`}
      >
        <div className={styles.panelContent}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h3>Spiral Controls</h3>
              <button
                type="button"
                onClick={onToggleAction}
                className={styles.closeButton}
                aria-label="Close controls"
              >
                ×
              </button>
            </div>
            <div className={styles.headerButtons}>
              <button
                type="button"
                onClick={onRandomizeAllAction}
                className={styles.button}
                aria-label="Randomize all spiral sets"
              >
                🎲 Randomize
              </button>
              <button
                type="button"
                onClick={onAddSpiralSetAction}
                className={styles.button}
                aria-label="Add new spiral set"
              >
                ➕ Add Set
              </button>
            </div>
          </div>

          <div className={styles.spiralSets}>
            {configs.map((config, index) => (
              <div
                key={`spiral-set-${config.name}-${index}`}
                className={styles.spiralSet}
                style={
                  {
                    "--spiral-color": `hsl(${config.hue}, ${config.saturation}%, ${config.lightness}%)`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.setHeader}>
                  <h4 className={styles.setName}>{config.name}</h4>
                  <button
                    type="button"
                    onClick={() => onRemoveSpiralSetAction(index)}
                    className={styles.removeButton}
                    aria-label={`Remove spiral set ${config.name}`}
                    disabled={configs.length === 1}
                  >
                    ×
                  </button>
                </div>

                {/* Speed Control */}
                <div className={styles.controlGroup}>
                  <label htmlFor={`speed-${index}`}>Speed</label>
                  <input
                    id={`speed-${index}`}
                    type="range"
                    min="5000"
                    max="60000"
                    step="1000"
                    value={config.animationSpeed}
                    onChange={(e) =>
                      onConfigChangeAction(
                        {
                          ...config,
                          animationSpeed: Number(e.target.value),
                        },
                        index,
                      )
                    }
                    className={styles.slider}
                  />
                  <span className={styles.value}>
                    {Math.round(config.animationSpeed / 1000)}s
                  </span>
                </div>

                {/* Scale Control */}
                <div className={styles.controlGroup}>
                  <label htmlFor={`size-${index}`}>Scale</label>
                  <input
                    id={`size-${index}`}
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={config.animationScale}
                    onChange={(e) =>
                      onConfigChangeAction(
                        {
                          ...config,
                          animationScale: Number(e.target.value),
                        },
                        index,
                      )
                    }
                    className={styles.slider}
                  />
                  <span className={styles.value}>{config.animationScale}x</span>
                </div>

                {/* Circle Radius Control */}
                <div className={styles.controlGroup}>
                  <label htmlFor={`radius-${index}`}>Circle Size</label>
                  <input
                    id={`radius-${index}`}
                    type="range"
                    min="2"
                    max="80"
                    step="2"
                    value={config.circleRadius}
                    onChange={(e) =>
                      onConfigChangeAction(
                        {
                          ...config,
                          circleRadius: Number(e.target.value),
                        },
                        index,
                      )
                    }
                    className={styles.slider}
                  />
                  <span className={styles.value}>{config.circleRadius}px</span>
                </div>

                {/* Style Control */}
                <div className={styles.controlGroup}>
                  <label htmlFor={`style-${index}`}>Style</label>
                  <select
                    id={`style-${index}`}
                    value={config.fill ? "filled" : "outline"}
                    onChange={(e) => {
                      const isFilled = e.target.value === "filled";
                      onConfigChangeAction(
                        {
                          ...config,
                          fill: isFilled,
                          strokeWidth: isFilled ? 0 : config.strokeWidth || 2,
                        },
                        index,
                      );
                    }}
                    className={styles.select}
                  >
                    <option value="filled">Filled</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>

                {/* Stroke Width Control (only when outline) */}
                {!config.fill && (
                  <div className={styles.controlGroup}>
                    <label htmlFor={`stroke-${index}`}>Stroke Width</label>
                    <input
                      id={`stroke-${index}`}
                      type="range"
                      min="0.5"
                      max="8"
                      step="0.5"
                      value={config.strokeWidth}
                      onChange={(e) =>
                        onConfigChangeAction(
                          {
                            ...config,
                            strokeWidth: Number(e.target.value),
                          },
                          index,
                        )
                      }
                      className={styles.slider}
                    />
                    <span className={styles.value}>{config.strokeWidth}</span>
                  </div>
                )}

                {/* Color Controls */}
                <div className={styles.colorControls}>
                  <div className={styles.controlGroup}>
                    <label htmlFor={`color-${index}`}>Color</label>
                    <input
                      id={`color-${index}`}
                      type="color"
                      value={hslToHex(
                        config.hue,
                        config.saturation,
                        config.lightness,
                      )}
                      onChange={(e) => {
                        const { h, s, l } = hexToHsl(e.target.value);
                        onConfigChangeAction(
                          {
                            ...config,
                            hue: h,
                            saturation: s,
                            lightness: l,
                          },
                          index,
                        );
                      }}
                      className={styles.colorPicker}
                    />
                    <span className={styles.value}>
                      HSL({config.hue}, {config.saturation}%, {config.lightness}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Download Button */}
        <div className={styles.downloadSection}>
          <button
            type="button"
            onClick={() => saveSvg(".fractal", generateFileName())}
            className={styles.downloadButton}
            aria-label="Download SVG"
          >
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiralsControls;

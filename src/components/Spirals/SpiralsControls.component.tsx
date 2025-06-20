"use client";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import {
  hexToOklch,
  oklchToHex,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import styles from "src/components/Spirals/SpiralsControls.module.css";
import { saveSvg } from "src/utils/helpers";

interface SpiralsControlsProps {
  configs: SpiralsConfig[];
  onConfigChangeAction: (config: SpiralsConfig, index: number) => void;
  onAddSpiralSetAction: () => void;
  onRemoveSpiralSetAction: (id: string) => void;
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

  // Throttle refs for each color input
  const colorThrottleRefs = useRef<Record<number, NodeJS.Timeout | null>>({});

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
        className={classNames(styles.panel, {
          [styles.open]: isOpen,
          [styles.transitioning]: isTransitioning,
        })}
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
                <span className={styles.closeIcon}>+</span>
              </button>
            </div>
            <div className={styles.headerButtons}>
              <button
                type="button"
                onClick={onRandomizeAllAction}
                className={classNames(
                  styles.button,
                  styles.headerButton,
                  styles.randomizeButton,
                )}
                aria-label="Randomize all spiral sets"
              >
                🎲 Random
              </button>
              <button
                type="button"
                onClick={onAddSpiralSetAction}
                className={classNames(
                  styles.button,
                  styles.headerButton,
                  styles.addButtonDesktop,
                )}
                aria-label="Add new spiral set"
              >
                + Add
              </button>
              <button
                type="button"
                onClick={() => saveSvg(".fractal", generateFileName())}
                className={classNames(
                  styles.button,
                  styles.headerButton,
                  styles.downloadButtonMobile,
                )}
                aria-label="Download SVG"
              >
                💾 Save
              </button>
            </div>
          </div>

          <ul className={styles.spiralSets}>
            {configs.map((config, index) => (
              <li
                key={config.id}
                className={styles.spiralSet}
                style={
                  {
                    "--spiral-color": `oklch(${config.lightness} ${config.chroma} ${config.hue})`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.setHeader}>
                  <h4 className={styles.setName}>{config.name}</h4>
                  <button
                    type="button"
                    onClick={() => onRemoveSpiralSetAction(config.id)}
                    className={styles.removeButton}
                    aria-label={`Remove spiral set ${config.name}`}
                    disabled={configs.length === 1}
                  >
                    ×
                  </button>
                </div>

                <fieldset className={styles.controlsFieldset}>
                  <legend className={styles.controlsLegend}>
                    Spiral Configuration
                  </legend>

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
                      min="0.5"
                      max="5"
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
                    <span className={styles.value}>
                      {config.animationScale}x
                    </span>
                  </div>

                  {/* Shape Count Control */}
                  <div className={styles.controlGroup}>
                    <label htmlFor={`count-${index}`}>Shape Count</label>
                    <input
                      id={`count-${index}`}
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={config.circleCount}
                      onChange={(e) =>
                        onConfigChangeAction(
                          {
                            ...config,
                            circleCount: Number(e.target.value),
                          },
                          index,
                        )
                      }
                      className={styles.slider}
                    />
                    <span className={styles.value}>
                      {config.circleCount} shapes
                    </span>
                  </div>

                  {/* Spiral Spacing Control */}
                  <div className={styles.controlGroup}>
                    <label htmlFor={`spacing-${index}`}>Spiral Spacing</label>
                    <input
                      id={`spacing-${index}`}
                      type="range"
                      min="0.25"
                      max="1"
                      step="0.05"
                      value={config.spiralSpacing}
                      onChange={(e) =>
                        onConfigChangeAction(
                          {
                            ...config,
                            spiralSpacing: Number(e.target.value),
                          },
                          index,
                        )
                      }
                      className={styles.slider}
                    />
                    <span className={styles.value}>
                      {config.spiralSpacing.toFixed(2)}
                    </span>
                  </div>

                  {/* Shape Size Control */}
                  <div className={styles.controlGroup}>
                    <label htmlFor={`radius-${index}`}>Shape Size</label>
                    <input
                      id={`radius-${index}`}
                      type="range"
                      min="2"
                      max="80"
                      step="2"
                      value={config.elementSize}
                      onChange={(e) =>
                        onConfigChangeAction(
                          {
                            ...config,
                            elementSize: Number(e.target.value),
                          },
                          index,
                        )
                      }
                      className={styles.slider}
                    />
                    <span className={styles.value}>{config.elementSize}px</span>
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

                  {/* Shape Control */}
                  <div className={styles.controlGroup}>
                    <label htmlFor={`shape-${index}`}>Shape</label>
                    <select
                      id={`shape-${index}`}
                      value={config.shape}
                      onChange={(e) => {
                        onConfigChangeAction(
                          {
                            ...config,
                            shape: e.target.value as
                              | "circle"
                              | "square"
                              | "triangle"
                              | "polygon",
                          },
                          index,
                        );
                      }}
                      className={styles.select}
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                      <option value="polygon">Polygon</option>
                    </select>
                  </div>

                  {/* Polygon Sides Control (only when polygon is selected) */}
                  {config.shape === "polygon" && (
                    <div className={styles.controlGroup}>
                      <label htmlFor={`sides-${index}`}>Polygon Sides</label>
                      <input
                        id={`sides-${index}`}
                        type="range"
                        min="3"
                        max="12"
                        step="1"
                        value={config.polygonSides}
                        onChange={(e) =>
                          onConfigChangeAction(
                            {
                              ...config,
                              polygonSides: Number(e.target.value),
                            },
                            index,
                          )
                        }
                        className={styles.slider}
                      />
                      <span className={styles.value}>
                        {config.polygonSides} sides
                      </span>
                    </div>
                  )}

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
                        value={oklchToHex(
                          config.lightness,
                          config.chroma,
                          config.hue,
                        )}
                        onChange={(e) => {
                          if (colorThrottleRefs.current[index]) {
                            clearTimeout(colorThrottleRefs.current[index]!);
                          }
                          const { l, c, h } = hexToOklch(e.target.value);
                          colorThrottleRefs.current[index] = setTimeout(() => {
                            onConfigChangeAction(
                              {
                                ...config,
                                lightness: l,
                                chroma: c,
                                hue: h,
                              },
                              index,
                            );
                          }, 50);
                        }}
                        className={styles.colorPicker}
                      />
                      <span className={styles.value}>
                        OKLCH({config.lightness.toFixed(2)},{" "}
                        {config.chroma.toFixed(2)}, {config.hue.toFixed(0)})
                      </span>
                    </div>
                  </div>
                </fieldset>
              </li>
            ))}
          </ul>

          {/* Download Button - Desktop Only */}
          <div className={styles.downloadSection}>
            <button
              type="button"
              onClick={() => saveSvg(".fractal", generateFileName())}
              className={classNames(styles.button, styles.downloadButton)}
              aria-label="Download SVG"
            >
              💾 Download
            </button>
          </div>

          {/* Floating Add Button */}
          <button
            type="button"
            onClick={onAddSpiralSetAction}
            className={styles.floatingAddButton}
            aria-label="Add new spiral set"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiralsControls;

"use client";

import classNames from "classnames";
import { Activity, useEffect, useEffectEvent, useRef, useState } from "react";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import {
  generateSpiralFileName,
  HARMONIC_MINIMUMS,
  hexToOklch,
  type OklchColor,
  oklchToHex,
  resolveLightnessForTheme,
  storeLightnessFromPicker,
} from "src/components/Spirals/Spirals.utils";
import styles from "src/components/Spirals/SpiralsControls.module.css";
import { usePreferredTheme } from "src/hooks/usePreferredTheme";
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
  const { currentTheme } = usePreferredTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const SLIDER_THROTTLE_MS = 50;
  const colorThrottleRefs = useRef<Record<number, NodeJS.Timeout | null>>({});
  const sliderThrottleRefs = useRef<Record<string, NodeJS.Timeout | null>>({});
  const applyConfigChange = useEffectEvent(onConfigChangeAction);

  const scheduleConfigUpdate = (
    throttleKey: string,
    index: number,
    nextConfig: SpiralsConfig,
  ) => {
    const existing = sliderThrottleRefs.current[throttleKey];
    if (existing) {
      clearTimeout(existing);
    }

    sliderThrottleRefs.current[throttleKey] = setTimeout(() => {
      applyConfigChange(nextConfig, index);
    }, SLIDER_THROTTLE_MS);
  };

  useEffect(() => {
    return () => {
      for (const timer of Object.values(colorThrottleRefs.current)) {
        if (timer) {
          clearTimeout(timer);
        }
      }
      for (const timer of Object.values(sliderThrottleRefs.current)) {
        if (timer) {
          clearTimeout(timer);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (prevIsOpen !== isOpen) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
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

  return (
    <div
      className={styles.controlsContainer}
      data-testid="rhSpiralsControls"
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Spiral controls panel"
      tabIndex={-1}
    >
      <Activity mode={isOpen ? "visible" : "hidden"} name="SpiralControls">
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
                  onClick={() =>
                    saveSvg(".fractal", generateSpiralFileName(configs))
                  }
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
              {configs.map((config, index) => {
                const displayLightness = resolveLightnessForTheme(
                  config.lightness,
                  currentTheme,
                );

                return (
                  <li
                    key={config.id}
                    className={styles.spiralSet}
                    style={
                      {
                        "--spiral-color": `oklch(${displayLightness} ${config.chroma} ${config.hue})`,
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
                        disabled={
                          configs.length <= HARMONIC_MINIMUMS.minSpiralSetCount
                        }
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
                            scheduleConfigUpdate(`speed-${index}`, index, {
                              ...config,
                              animationSpeed: Number(e.target.value),
                            })
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
                            scheduleConfigUpdate(`scale-${index}`, index, {
                              ...config,
                              animationScale: Number(e.target.value),
                            })
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
                            scheduleConfigUpdate(`count-${index}`, index, {
                              ...config,
                              circleCount: Number(e.target.value),
                            })
                          }
                          className={styles.slider}
                        />
                        <span className={styles.value}>
                          {config.circleCount} shapes
                        </span>
                      </div>

                      {/* Spiral Spacing Control */}
                      <div className={styles.controlGroup}>
                        <label htmlFor={`spacing-${index}`}>
                          Spiral Spacing
                        </label>
                        <input
                          id={`spacing-${index}`}
                          type="range"
                          min="0.25"
                          max="1"
                          step="0.05"
                          value={config.spiralSpacing}
                          onChange={(e) =>
                            scheduleConfigUpdate(`spacing-${index}`, index, {
                              ...config,
                              spiralSpacing: Number(e.target.value),
                            })
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
                            scheduleConfigUpdate(`radius-${index}`, index, {
                              ...config,
                              elementSize: Number(e.target.value),
                            })
                          }
                          className={styles.slider}
                        />
                        <span className={styles.value}>
                          {config.elementSize}px
                        </span>
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
                                strokeWidth: isFilled
                                  ? 0
                                  : config.strokeWidth || 2,
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
                      {config.shape === "polygon" ? (
                        <div className={styles.controlGroup}>
                          <label htmlFor={`sides-${index}`}>
                            Polygon Sides
                          </label>
                          <input
                            id={`sides-${index}`}
                            type="range"
                            min="3"
                            max="12"
                            step="1"
                            value={config.polygonSides}
                            onChange={(e) =>
                              scheduleConfigUpdate(`sides-${index}`, index, {
                                ...config,
                                polygonSides: Number(e.target.value),
                              })
                            }
                            className={styles.slider}
                          />
                          <span className={styles.value}>
                            {config.polygonSides} sides
                          </span>
                        </div>
                      ) : null}

                      {!config.fill ? (
                        <div className={styles.controlGroup}>
                          <label htmlFor={`stroke-${index}`}>
                            Stroke Width
                          </label>
                          <input
                            id={`stroke-${index}`}
                            type="range"
                            min="0.5"
                            max="8"
                            step="0.5"
                            value={config.strokeWidth}
                            onChange={(e) =>
                              scheduleConfigUpdate(`stroke-${index}`, index, {
                                ...config,
                                strokeWidth: Number(e.target.value),
                              })
                            }
                            className={styles.slider}
                          />
                          <span className={styles.value}>
                            {config.strokeWidth}
                          </span>
                        </div>
                      ) : null}

                      {/* Color Controls */}
                      <div className={styles.colorControls}>
                        <div className={styles.controlGroup}>
                          <label htmlFor={`color-${index}`}>Color</label>
                          <input
                            id={`color-${index}`}
                            type="color"
                            value={oklchToHex(
                              displayLightness,
                              config.chroma,
                              config.hue,
                            )}
                            onChange={(e) => {
                              if (colorThrottleRefs.current[index]) {
                                clearTimeout(colorThrottleRefs.current[index]);
                              }
                              const oklch: OklchColor = hexToOklch(
                                e.target.value,
                              );
                              colorThrottleRefs.current[index] = setTimeout(
                                () => {
                                  applyConfigChange(
                                    {
                                      ...config,
                                      lightness: storeLightnessFromPicker(
                                        oklch.l,
                                        currentTheme,
                                      ),
                                      chroma: oklch.c,
                                      hue: oklch.h,
                                    },
                                    index,
                                  );
                                },
                                50,
                              );
                            }}
                            className={styles.colorPicker}
                          />
                          <span className={styles.value}>
                            OKLCH({displayLightness.toFixed(2)},{" "}
                            {config.chroma.toFixed(2)}, {config.hue.toFixed(0)})
                          </span>
                        </div>
                      </div>
                    </fieldset>
                  </li>
                );
              })}
            </ul>

            {/* Download Button - Desktop Only */}
            <div className={styles.downloadSection}>
              <button
                type="button"
                onClick={() =>
                  saveSvg(".fractal", generateSpiralFileName(configs))
                }
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
      </Activity>
    </div>
  );
};

export default SpiralsControls;

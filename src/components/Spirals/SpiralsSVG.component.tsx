"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import {
  SPIRALS_CONSTANTS as constant,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import { SVG } from "src/components/SVG/SVG.component";

interface SpiralsSVGProps {
  visible: boolean;
  configs: SpiralsConfig[];
}

// Virtualization settings
const BATCH_SIZE = 3; // Number of spiral sets to render at once
const BATCH_DELAY = 100; // Delay between batches in ms

export const SpiralsSVG = ({ visible = false, configs }: SpiralsSVGProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleConfigs, setVisibleConfigs] = useState<SpiralsConfig[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the reversed configs to avoid unnecessary re-renders
  const reversedConfigs = useMemo(() => {
    return configs.slice().reverse();
  }, [configs]);

  // Calculate which configs should be visible based on current batch
  const calculateVisibleConfigs = useCallback(() => {
    const startIndex = 0;
    const endIndex = Math.min(
      (currentBatch + 1) * BATCH_SIZE,
      reversedConfigs.length,
    );
    return reversedConfigs.slice(startIndex, endIndex);
  }, [reversedConfigs, currentBatch]);

  // Load configs in batches for better performance
  useEffect(() => {
    if (!visible || reversedConfigs.length === 0) {
      setVisibleConfigs([]);
      setCurrentBatch(0);
      return;
    }

    // Clear any existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    // Load first batch immediately
    setVisibleConfigs(calculateVisibleConfigs());

    // Load remaining batches with delay
    if (reversedConfigs.length > BATCH_SIZE) {
      const totalBatches = Math.ceil(reversedConfigs.length / BATCH_SIZE);

      const loadNextBatch = () => {
        setCurrentBatch((prev) => {
          const nextBatch = prev + 1;
          if (nextBatch < totalBatches) {
            // Schedule next batch
            batchTimeoutRef.current = setTimeout(loadNextBatch, BATCH_DELAY);
          }
          return nextBatch;
        });
      };

      // Schedule first delayed batch
      batchTimeoutRef.current = setTimeout(loadNextBatch, BATCH_DELAY);
    }

    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [visible, reversedConfigs, calculateVisibleConfigs]);

  // Update visible configs when batch changes
  useEffect(() => {
    setVisibleConfigs(calculateVisibleConfigs());
  }, [calculateVisibleConfigs]);

  // Trigger fade-in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure everything is ready

    return () => clearTimeout(timer);
  }, []);

  // Memoize the spiral elements to prevent unnecessary re-renders
  const spiralElements = useMemo(() => {
    return visibleConfigs.map((config) => (
      <Spirals key={`spiral-config-${config.id}`} config={config} />
    ));
  }, [visibleConfigs]);

  return (
    <SVG
      className="fractal"
      viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      visible={visible}
      style={{
        backgroundColor: "var(--color-bg)",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      {spiralElements}
    </SVG>
  );
};

export default SpiralsSVG;

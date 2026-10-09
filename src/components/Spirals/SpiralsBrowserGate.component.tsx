"use client";

import type { ReactNode } from "react";
import { use } from "react";
import { browser } from "react-dom";

export interface SpiralsBrowserGateProps {
  children: ReactNode;
}

export const SpiralsBrowserGate = ({ children }: SpiralsBrowserGateProps) => {
  use(browser("Spirals background uses GSAP and browser-only APIs."));
  return children;
};

export default SpiralsBrowserGate;

import { device } from "src/styles/theme";
import styled from "styled-components";

const TOP = "20em";

export const SVG = styled.svg`
  position: fixed;
  top: -${TOP};
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
  height: calc(100vh + ${TOP});
  width: 100vw;
  opacity: 0.75;
  transition: opacity 0.25s ease-in-out;

  @media ${device.tablet} {
    opacity: 1;
    top: 0;
    height: 100%;
    height: 100vh;
  }
`;

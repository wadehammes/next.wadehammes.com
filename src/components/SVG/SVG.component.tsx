import { device } from "src/styles/theme";
import styled, { css } from "styled-components";

const TOP = "24rem";

interface SVGProps {
  visible: boolean;
}

export const SVG = styled.svg<SVGProps>`
  position: fixed;
  top: -${TOP};
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  height: calc(100% + ${TOP});
  width: 100%;
  width: 100vw;
  opacity: 0;
  transition: opacity 1s ease-in-out;

  ${({ visible }) =>
    visible &&
    css`
      opacity: 0.85;
    `}

  @media ${device.tablet} {
    top: 0;
    height: 100%;

    ${({ visible }) =>
      visible &&
      css`
        opacity: 1;
      `}
  }
`;

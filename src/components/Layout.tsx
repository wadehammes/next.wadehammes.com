import { device } from "src/styles/theme";
import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-rows: 4fr 1fr;
  grid-gap: 5em;
  height: 100vh;
  width: 100%;
`;

export const Footer = styled.footer`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  p {
    max-width: 100%;

    @media ${device.tablet} {
      max-width: 72ch;
    }
  }

  .refresh {
    display: none;

    @media ${device.tablet} {
      display: flex;
    }
  }
`;

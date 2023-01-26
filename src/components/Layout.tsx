import { device } from "src/styles/theme";
import styled from "styled-components";

interface GridProps {
  gridHeight?: number | null;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-rows: 8em 1fr;
  grid-gap: 0;
  height: calc(100vh - env(safe-area-inset-bottom));
  width: 100%;
`;

export const Container = styled.div`
  padding: var(--sizing-mobilePadding);
  width: 100%;

  @media ${device.tablet} {
    padding: var(--sizing-desktopPadding);
  }
`;

export const Content = styled(Container)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  height: 100%;
`;

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;

  @media screen and (min-width: 72rem) {
    justify-content: flex-end;
  }
`;

export const Footer = styled.footer`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  z-index: 1;

  @media screen and (min-width: 72rem) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

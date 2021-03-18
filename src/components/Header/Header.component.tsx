import { FC } from "react";
import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";
import { device } from "src/styles/theme";

const Container = styled.nav`
  position: relative;
  padding: ${({ theme }) => theme.sizing.mobilePadding};
  z-index: 99;
  width: 100%;

  @media ${device.tablet} {
    padding: ${({ theme }) => theme.sizing.desktopPadding};
  }
`;

const Logo = styled.div`
  width: 3em;

  @media ${device.tablet} {
    width: 5em;
  }

  &:hover {
    svg {
      fill: transparent;
      stroke: ${({ theme }) => theme.colors.white};
      paint-order: stroke;
    }
  }
`;

export const Header: FC = () => {
  return (
    <Container>
      <Logo>
        <Link href="/" passHref>
          <a>
            <Crown />
          </a>
        </Link>
      </Logo>
    </Container>
  );
};

import { FC } from "react";
import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";
import { device } from "src/styles/theme";
import { Container } from "src/components/Layout";

const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 99;
  padding-top: 0;
  padding-bottom: 0;
`;

const Logo = styled.div`
  width: 4rem;

  svg {
    transform: rotate(0);
    transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-origin: center center;

    &:hover {
      fill: transparent;
      stroke: var(--color-text);
      paint-order: stroke;
      transform: rotate(-10deg);
    }
  }

  @media ${device.tablet} {
    width: 5rem;
  }
`;

export const Header: FC = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Link href="/">
          <Crown />
        </Link>
      </Logo>
    </HeaderContainer>
  );
};

export default Header;

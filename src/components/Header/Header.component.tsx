import { FC } from "react";
import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";
import { device } from "src/styles/theme";
import { Container } from "src/components/Layout";

const LogoContainer = styled(Container)`
  position: relative;
  z-index: 99;
  padding-bottom: 0;
`;

const Logo = styled.div`
  width: 3rem;

  @media ${device.tablet} {
    width: 5rem;
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
    <LogoContainer>
      <Logo>
        <Link href="/" passHref>
          <a>
            <Crown />
          </a>
        </Link>
      </Logo>
    </LogoContainer>
  );
};

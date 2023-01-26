import { FC } from "react";
import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";
import { device } from "src/styles/theme";
import { Container } from "src/components/Layout";
import { usePreferredTheme, Themes } from "src/hooks/usePreferredTheme";
import { Sun } from "src/styles/icons/sun";
import { Moon } from "src/styles/icons/moon";

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
    transition: transform 0.2s ease-in-out;
    transform-origin: center center;
  }

  &:hover {
    svg {
      fill: transparent;
      stroke: var(--color-text);
      paint-order: stroke;
      transform: rotate(-5deg);
    }
  }

  @media ${device.tablet} {
    width: 5rem;
  }
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: 0;
  padding: 0;

  svg {
    height: 24px;
    width: 24px;
    transition: transform 0.1s ease-in;
    transform-origin: center center;
    transform: rotate(0);
  }

  &:active svg {
    transform: rotate(-15deg);
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Header: FC = () => {
  const { currentTheme, updateTheme } = usePreferredTheme();

  return (
    <HeaderContainer>
      <Logo>
        <Link href="/">
          <Crown />
        </Link>
      </Logo>
      <ThemeToggleContainer>
        <ThemeToggle
          type="button"
          onClick={() =>
            updateTheme(
              currentTheme === Themes.Light ? Themes.Dark : Themes.Light,
            )
          }
        >
          {currentTheme === Themes.Light ? <Moon /> : <Sun />}
        </ThemeToggle>
      </ThemeToggleContainer>
    </HeaderContainer>
  );
};

export default Header;

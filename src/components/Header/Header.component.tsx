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

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  transition: transform 0.2s ease-in;
  transform-origin: center center;
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 0;

  &:hover {
    cursor: pointer;
  }

  &:hover:active {
    transform: translateY(2px);
  }

  > svg {
    height: 24px;
    width: 24px;
  }
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

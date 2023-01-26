import { FCWithChildren } from "src/@types/react";
import {
  ButtonElementProps,
  ButtonProps,
  ButtonVariants,
} from "src/components/Button/Button.interfaces";
import { device } from "src/styles/theme";
import styled, { css } from "styled-components";

const ButtonElement = styled.button<ButtonElementProps>`
  display: flex;
  align-items: center;
  appearance: none;
  color: var(--color-text);
  border: 2px solid transparent;
  border-radius: 1000px;
  background-color: transparent;
  padding: 0.75em 2em;
  font-weight: 600;
  font-family: inherit;
  transition: transform 0.1s ease-in;
  font-size: 0.8em;

  @media ${device.tablet} {
    font-size: inherit;
  }

  &:hover {
    background-color: var(--color-bg);
    border-color: var(--color-text);
    transform: rotate(-2deg);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: var(--color-bg);
  }

  &:hover:active {
    background-color: var(--color-bg);
    transform: rotate(-2deg) translateY(2px);
  }

  svg {
    margin-right: 0.75em;
    height: 1.25em;
    width: 1.25em;
  }

  ${({ variant }) =>
    variant === ButtonVariants.Primary &&
    css`
      background: var(--color-text);
      color: var(--color-bg);
      box-shadow: 2px 4px 15px var(--colors-alphaBlack);

      &:hover {
        background: var(--color-text);
        color: var(--color-bg);
      }

      &:active {
        background: var(--color-text);
        color: var(--color-bg);
      }

      &:focus:active {
        background: var(--color-text);
        color: var(--color-bg);
      }
    `}
`;

export const Button: FCWithChildren<ButtonProps> = ({
  children,
  handleClick,
  variant = ButtonVariants.Primary,
  className,
  label,
}) => (
  <ButtonElement
    type="button"
    tabIndex={0}
    className={className}
    variant={variant}
    onClick={handleClick}
  >
    {children ?? label ?? ""}
  </ButtonElement>
);

export default Button;

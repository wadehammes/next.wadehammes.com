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
  color: var(--colors-white);
  border: none;
  border-radius: 1000px;
  background-color: transparent;
  padding: 0.75em 2em;
  font-weight: 600;
  font-family: inherit;
  transition: background-color 0.05s ease-in-out, transform 0.2s ease-in-out;
  font-size: 0.8em;

  @media ${device.tablet} {
    font-size: inherit;
  }

  &:hover {
    background-color: var(--colors-alphaBlack);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: var(--colors-alphaBlack);
  }

  &:focus:active {
    background-color: var(--colors-alphaBlack);
  }

  svg {
    margin-right: 0.75em;
    height: 1.25em;
    width: 1.25em;
  }

  ${({ variant }) =>
    variant === ButtonVariants.Primary &&
    css`
      background: var(--colors-white);
      color: var(--colors-trueBlack);
      box-shadow: 2px 4px 15px var(--colors-alphaBlack);

      &:hover {
        color: var(--colors-white);
        background-color: var(--colors-gray);
      }

      &:focus {
        color: var(--colors-white);
        background-color: var(--colors-gray);
      }

      &:focus:active {
        background-color: var(--colors-gray);
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

import { FC } from "react";
import { device } from "src/styles/theme";
import styled, { css } from "styled-components";
import {
  ButtonElementProps,
  ButtonProps,
  ButtonVariants,
} from "src/components/Button/Button.interfaces";

const ButtonElement = styled.button<ButtonElementProps>`
  display: flex;
  align-items: center;
  appearance: none;
  color: ${({ theme }) => theme.colors.white};
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
    background-color: ${({ theme }) => theme.colors.alphaBlack};
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: ${({ theme }) => theme.colors.alphaBlack};
  }

  &:focus:active {
    background-color: ${({ theme }) => theme.colors.alphaBlack};
  }

  svg {
    margin-right: 0.75em;
    height: 1.25em;
    width: 1.25em;
  }

  ${({ variant }) =>
    variant === ButtonVariants.Primary &&
    css`
      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.trueBlack};
      box-shadow: 2px 4px 15px ${({ theme }) => theme.colors.alphaBlack};

      &:hover {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.red};
      }

      &:focus {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.red};
      }

      &:focus:active {
        background-color: ${({ theme }) => theme.colors.red};
      }
    `}
`;

export const Button: FC<ButtonProps> = ({
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

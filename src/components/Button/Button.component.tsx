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
  color: inherit;
  border: 0;
  border-radius: 1000px;
  background-color: transparent;
  padding: 1rem;
  font-weight: 600;
  font-family: inherit;
  transition: transform 0.1s ease-in;
  font-size: 0.8em;

  @media ${device.tablet} {
    font-size: inherit;
  }

  &:hover {
    background-color: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  &:hover:active {
    background-color: var(--color-bg);
    transform: scale(0.95);
  }

  svg {
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

  ${({ hasTooltip }) =>
    hasTooltip &&
    css`
      position: relative;

      &::before {
        position: absolute;
        bottom: calc(100% + 15px);
        left: -40px;
        background-color: var(--color-text);
        border-radius: 5px;
        color: var(--color-bg);
        content: attr(aria-label);
        padding: 0.75rem 1rem;
        text-transform: none;
        transition: all 0.5s ease;
        min-width: 125px;
        max-width: 200px;
      }

      &::after {
        position: absolute;
        top: -15px;
        left: 25px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--color-text);
        content: " ";
        font-size: 0;
        line-height: 0;
        margin-left: -5px;
        width: 0;
      }

      &::before,
      &::after {
        color: var(--color-bg);
        font-size: 0.75rem;
        opacity: 0;
        pointer-events: none;
        text-align: center;
      }

      &:focus::before,
      &:focus::after,
      &:hover::before,
      &:hover::after {
        opacity: 1;
        transition: all 0.75s ease;
      }
    `}
`;

export const Button: FCWithChildren<ButtonProps> = ({
  children,
  handleClick,
  variant = ButtonVariants.Primary,
  className,
  label,
  hasTooltip,
  ariaLabel,
}) => (
  <ButtonElement
    type="button"
    tabIndex={0}
    className={className}
    variant={variant}
    onClick={handleClick}
    hasTooltip={hasTooltip}
    aria-label={ariaLabel ?? label}
  >
    {children ?? label ?? ""}
  </ButtonElement>
);

export default Button;

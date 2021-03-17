import { FC } from "react";
import { device } from "src/styles/theme";
import { randomIntFromInterval } from "src/utils/helpers";
import styled, { css } from "styled-components";

export enum ButtonVariants {
  Text = "Text",
  Primary = "Primary",
}
interface ButtonElementProps {
  fixed?: boolean;
  variant?: ButtonVariants;
}

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
    background-color: rgba(0, 0, 0, 0.25);
    cursor: pointer;
  }

  &:focus {
    outline: 0;
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    margin-right: 0.75em;
    height: 1.1em;
    width: 1.1em;
  }

  ${({ variant }) =>
    variant === ButtonVariants.Primary &&
    css`
      background: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.trueBlack};
      box-shadow: 2px 4px 15px rgba(0, 0, 0, 0.15);

      &:hover {
        color: white;
        background-color: ${({ theme }) => theme.colors.red};
      }

      &:focus {
        color: white;
        background-color: ${`hsla(${randomIntFromInterval(
          0,
          360,
        )}, ${randomIntFromInterval(0, 100)}%, ${randomIntFromInterval(
          0,
          25,
        )}%)`};
      }

      &:focus:active {
        background-color: ${({ theme }) => theme.colors.red};
      }
    `}
`;

interface ButtonProps {
  handleClick?: () => void;
  variant?: ButtonVariants;
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  handleClick,
  variant = ButtonVariants.Primary,
  className,
}) => {
  return (
    <ButtonElement
      className={className}
      variant={variant}
      onClick={handleClick}
    >
      {children}
    </ButtonElement>
  );
};

import { FC } from "react";
import { device } from "src/styles/theme";
import { randomIntFromInterval } from "src/utils/helpers";
import styled, { css } from "styled-components";

interface ButtonElementProps {
  fixed?: boolean;
}

const ButtonElement = styled.button<ButtonElementProps>`
  display: flex;
  align-items: center;
  appearance: none;
  border: none;
  background: white;
  border-radius: 1000px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  font-family: inherit;
  font-size: 1rem;
  transition: background-color 0.05s ease-in-out;

  svg {
    margin-right: 1em;
    height: 1.1em;
    width: 1.1em;
  }

  &:hover {
    color: white;
    background-color: ${({ theme }) => theme.colors.red};
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    color: white;
    background-color: ${`hsla(${randomIntFromInterval(
      0,
      360,
    )}, ${randomIntFromInterval(0, 100)}%, ${randomIntFromInterval(0, 25)}%)`};
  }
`;

interface ButtonProps {
  handleClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, handleClick }) => {
  return <ButtonElement onClick={handleClick}>{children}</ButtonElement>;
};

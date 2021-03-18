import { randomIntFromInterval } from "src/utils/helpers";
import styled from "styled-components";

export const A = styled.a`
  font-family: inherit;
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.colors.red};
    text-decoration: none;
    color: ${({ theme }) => theme.colors.white};
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: ${({ theme }) => theme.colors.red};
    color: ${({ theme }) => theme.colors.white};
  }
`;

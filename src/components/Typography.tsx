import { randomIntFromInterval } from "src/utils/helpers";
import styled from "styled-components";

export const A = styled.a`
  font-family: monospace;
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    background-color: ${({ theme }) => theme.colors.red};
    color: white;
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background-color: ${({ theme }) => theme.colors.red};
    color: white;
  }
`;

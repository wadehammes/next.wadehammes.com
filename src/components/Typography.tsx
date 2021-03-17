import { randomIntFromInterval } from "src/utils/helpers";
import styled from "styled-components";

export const A = styled.a`
  font-family: monospace;
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    background: ${`hsla(${randomIntFromInterval(
      0,
      360,
    )}, ${randomIntFromInterval(0, 100)}%, ${randomIntFromInterval(0, 25)}%)`};
    color: white;
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    background: ${`hsla(${randomIntFromInterval(
      0,
      360,
    )}, ${randomIntFromInterval(0, 100)}%, ${randomIntFromInterval(0, 25)}%)`};
    color: white;
  }
`;

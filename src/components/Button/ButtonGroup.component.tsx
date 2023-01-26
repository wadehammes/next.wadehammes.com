import { FC } from "react";
import { PropsWithChildrenOnly } from "src/@types/react";
import styled from "styled-components";

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.25rem;
  background: var(--color-text);
  border-radius: 1000px;
  padding: 2px;
  color: var(--color-bg);
  position: relative;

  &::after,
  &::before {
    position: absolute;
    left: 50%;
    border: 10px solid transparent;
    border-top-color: solid var(--color-bg);
    content: " ";
    font-size: 0;
    line-height: 0;
    margin-left: -10px;
    width: 0;
  }

  &::after {
    top: 0;
  }

  &::before {
    bottom: 0;
    border-top-color: transparent;
    border-bottom-color: var(--color-bg);
  }

  @media screen and (min-width: 60rem) {
    font-size: 1rem;
  }
`;

export const ButtonGroup: FC<PropsWithChildrenOnly> = ({ children }) => (
  <Group>{children}</Group>
);

export default ButtonGroup;

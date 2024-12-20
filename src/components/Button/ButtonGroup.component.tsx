import type { FC } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
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

  @media screen and (min-width: 60rem) {
    font-size: 1rem;
  }
`;

export const ButtonGroup: FC<PropsWithChildrenOnly> = ({ children }) => (
  <Group>{children}</Group>
);

export default ButtonGroup;

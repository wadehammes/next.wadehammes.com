import { FC } from "react";
import styled from "styled-components";

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.5rem;
  font-size: 1rem;

  > * + * {
    margin-left: 0.75rem;
  }
`;

export const ButtonGroup: FC = ({ children }) => <Group>{children}</Group>;

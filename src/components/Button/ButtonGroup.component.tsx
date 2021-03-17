import { FC } from "react";
import styled from "styled-components";

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  > * + * {
    margin-left: 1em;
  }
`;

export const ButtonGroup: FC = ({ children }) => <Group>{children}</Group>;

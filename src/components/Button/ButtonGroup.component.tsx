import { FC } from "react";
import { device } from "src/styles/theme";
import styled from "styled-components";

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.5rem;
  font-size: 0.9em;

  @media ${device.tablet} {
    font-size: 1rem;
  }

  > * + * {
    margin-left: 0.75rem;
  }
`;

export const ButtonGroup: FC = ({ children }) => <Group>{children}</Group>;

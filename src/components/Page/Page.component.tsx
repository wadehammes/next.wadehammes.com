import { FC } from "react";
import styled from "styled-components";
import { Header } from "src/components/Header/Header.component";
import { Grid } from "src/components/Layout";
import { Helmet } from "./Helmet.component";

const Content = styled.div`
  width: 100%;
`;

export const Page: FC = ({ children }) => (
  <>
    <Helmet />
    <Grid>
      <Header />
      <Content>{children}</Content>
    </Grid>
  </>
);

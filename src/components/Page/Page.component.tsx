import { FC } from "react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "./Helmet.component";

export const Page: FC = ({ children }) => (
  <>
    <Helmet />
    <Grid>
      <Header />
      <Content>{children}</Content>
    </Grid>
  </>
);

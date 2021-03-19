import { FC } from "react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";
import { useWindowDimensions } from "src/hooks/useWindowDimensions";

export const Page: FC = ({ children }) => {
  const { height } = useWindowDimensions();

  return height ? (
    <>
      <Helmet />
      <Grid gridHeight={height}>
        <Header />
        <Content>{children}</Content>
      </Grid>
    </>
  ) : null;
};

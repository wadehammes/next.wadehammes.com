import { forwardRef, Ref } from "react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";
import { useWindowDimensions } from "src/hooks/useWindowDimensions";

export const Page = forwardRef(({ children }, ref: Ref<HTMLDivElement>) => {
  const { height } = useWindowDimensions();

  return height ? (
    <>
      <Helmet />
      <Grid ref={ref} gridHeight={height}>
        <Header />
        <Content>{children}</Content>
      </Grid>
    </>
  ) : null;
});

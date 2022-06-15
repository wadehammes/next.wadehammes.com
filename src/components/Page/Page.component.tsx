import { forwardRef, Ref } from "react";
import { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";
import { useWindowDimensions } from "src/hooks/useWindowDimensions";

export const Page = forwardRef(
  ({ children }: PropsWithChildrenOnly, ref: Ref<HTMLDivElement>) => {
    const { height } = useWindowDimensions();

    return (
      <>
        <Helmet />
        <Grid ref={ref} gridHeight={height}>
          <Header />
          <Content>{children}</Content>
        </Grid>
      </>
    );
  },
);

export default Page;

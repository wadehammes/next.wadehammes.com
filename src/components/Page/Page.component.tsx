import { forwardRef, ReactElement, Ref } from "react";
import dynamic from "next/dynamic";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";
import { useWindowDimensions } from "src/hooks/useWindowDimensions";

const Header = dynamic(() => import("src/components/Header/Header.component"));

interface PageProps {
  children?: ReactElement | ReactElement[];
}

export const Page = forwardRef(
  ({ children }: PageProps, ref: Ref<HTMLDivElement>) => {
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
  },
);

export default Page;

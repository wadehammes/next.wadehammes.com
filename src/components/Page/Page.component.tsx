import { forwardRef, ReactElement, Ref } from "react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";

interface PageProps {
  children?: ReactElement | ReactElement[];
}

export const Page = forwardRef(
  ({ children }: PageProps, ref: Ref<HTMLDivElement>) => (
    <>
      <Helmet />
      <Grid ref={ref}>
        <Header />
        <Content>{children}</Content>
      </Grid>
    </>
  ),
);

export default Page;

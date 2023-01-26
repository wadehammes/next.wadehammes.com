import { forwardRef, Ref } from "react";
import { PropsWithChildrenOnly } from "src/@types/react";
import { Header } from "src/components/Header/Header.component";
import { Content, Grid } from "src/components/Layout";
import { Helmet } from "src/components/Page/Helmet.component";

export const Page = forwardRef(
  ({ children }: PropsWithChildrenOnly, ref: Ref<HTMLDivElement>) => (
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

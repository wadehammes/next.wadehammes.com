import { GetStaticProps } from "next";
import { FC, ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import { Footer } from "src/components/Layout";
import { Page } from "src/components/Page/Page.component";
import { SpiralsAbout } from "src/components/Spirals/SpiralsAbout.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
import { H1 } from "src/components/Typography";
import { isBrowser } from "src/utils/helpers";

const Home: FC = (): ReactElement => {
  const [clientReady, setClientReady] = useState<boolean>(false);
  const { inView, ref } = useInView({
    triggerOnce: true,
    initialInView: true,
    fallbackInView: true,
  });

  useEffect(() => {
    if (isBrowser()) {
      setClientReady(true);
    }
  }, []);

  return (
    <>
      <Page ref={ref}>
        <Footer>
          <H1>Hi, I'm Wade.</H1>
          <Bio />
          <SpiralsAbout />
        </Footer>
      </Page>
      {clientReady && <SpiralsSVG visible={inView} />}
    </>
  );
};

// eslint-disable-next-line require-await
export const getStaticProps: GetStaticProps = async () => ({
  props: {},
  revalidate: 60,
});

export default Home;

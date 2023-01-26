import { GetStaticProps } from "next";
import { FC, ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import { Footer, FooterActions } from "src/components/Layout";
import { Page } from "src/components/Page/Page.component";
import { SpiralsActions } from "src/components/Spirals/SpiralsActions";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
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
          <Bio />
          <FooterActions>
            <SpiralsActions />
          </FooterActions>
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

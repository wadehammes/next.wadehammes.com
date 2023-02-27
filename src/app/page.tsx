"use client";

import { FC, ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import { Footer, FooterActions } from "src/components/Layout";
import { PageContainer } from "src/components/PageContainer/Page.component";
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
    if (isBrowser() && inView) {
      setClientReady(true);
    }
  }, [inView]);

  return (
    <>
      <PageContainer ref={ref}>
        <Footer>
          <Bio />
          <FooterActions>
            <SpiralsActions />
          </FooterActions>
        </Footer>
      </PageContainer>
      {clientReady && <SpiralsSVG visible={inView} />}
    </>
  );
};

export default Home;

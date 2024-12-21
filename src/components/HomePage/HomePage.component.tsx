"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Bio } from "src/components/Bio/Bio.component";
import { Footer, FooterActions } from "src/components/Layout";
import PageContainer from "src/components/PageContainer/Page.component";
import SpiralsActions from "src/components/Spirals/SpiralsActions";
import SpiralsSVG from "src/components/Spirals/SpiralsSVG.component";
import { isBrowser } from "src/helpers/helpers";

export const HomePage = () => {
  const [key, updateKey] = useState<Date>(new Date());
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
            <SpiralsActions handleClick={updateKey} />
          </FooterActions>
        </Footer>
      </PageContainer>
      {clientReady && <SpiralsSVG key={key.toDateString()} visible={inView} />}
    </>
  );
};

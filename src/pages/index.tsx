import { GetStaticProps } from "next";
import { FC, ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Footer } from "src/components/Layout";
import { Page } from "src/components/Page/Page.component";
import { SpiralsAbout } from "src/components/Spirals/SpiralsAbout.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
import { H1, P } from "src/components/Typography";
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
          <P>
            I'm a software engineer for{" "}
            <a href="https://www.gotrhythm.com">Rhythm</a>, helping build the
            best customer experience in retail renewable energy, while currently
            living in Washington, D.C. For fun, I{" "}
            <a href="https://instagram.com/nthoftype">build keyboards/cables</a>{" "}
            and{" "}
            <a href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
              collect/play records
            </a>
            . Here's my <a href="mailto:w@dehammes.com">email</a>,{" "}
            <a href="https://github.com/wadehammes">code</a>,{" "}
            <a href="https://instagram.com/wade">insta</a>, and{" "}
            <a href="https://twitter.com/nthoftype">twitter</a>.
          </P>
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

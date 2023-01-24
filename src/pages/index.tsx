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
            <a
              href="https://www.gotrhythm.com"
              target="_blank"
              rel="noreferrer"
            >
              Rhythm
            </a>
            , helping build the best customer experience in retail renewable
            energy, while currently living in Washington, D.C. On the side, I'm
            building{" "}
            <a href="https://filtermydisco.gs" target="_blank" rel="noreferrer">
              FilterMyDisco.gs
            </a>
            , a new Discogs collection management tool. Here's my{" "}
            <a href="mailto:w@dehammes.com" target="_blank" rel="noreferrer">
              email
            </a>
            ,{" "}
            <a
              href="https://github.com/wadehammes"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
            ,{" "}
            <a
              href="https://instagram.com/wade"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            , and{" "}
            <a rel="me" href="https://mastodon.online/@wade">
              Mastodon
            </a>
            , and all other links{" "}
            <a
              href="https://linktr.ee/wadehammes"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
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

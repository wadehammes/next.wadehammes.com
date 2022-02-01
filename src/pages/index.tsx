import parse from "html-react-parser";
import { GetStaticProps } from "next";
import { FC, ReactElement } from "react";
import { useInView } from "react-intersection-observer";
import { Footer } from "src/components/Layout";
import { Page } from "src/components/Page/Page.component";
import { SpiralsAbout } from "src/components/Spirals/SpiralsAbout.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
import { H1, P } from "src/components/Typography";

const Home: FC = (): ReactElement => {
  const { inView, ref } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <Page ref={ref}>
        <Footer>
          <H1>Hi, {parse("I&apos;m")} Wade.</H1>
          <P>
            {parse("I&apos;m")} a software engineer for{" "}
            <a href="https://www.gotrhythm.com">Rhythm</a>, helping build the
            best customer experience in retail renewable energy in Texas (and
            hopefully beyond), while currently living in Washington, D.C. For
            fun, I{" "}
            <a href="https://instagram.com/nthoftype">build keyboards/cables</a>{" "}
            and{" "}
            <a href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
              collect/play records
            </a>
            . {parse("Here&apos;s")} my{" "}
            <a href="mailto:w@dehammes.com">email</a>,{" "}
            <a href="https://github.com/wadehammes">code</a>,{" "}
            <a href="https://instagram.com/wade">insta</a>, and{" "}
            <a href="https://twitter.com/nthoftype">twitter</a>.
          </P>
          <SpiralsAbout />
        </Footer>
      </Page>
      <SpiralsSVG visible={inView} />
    </>
  );
};

// eslint-disable-next-line require-await
export const getStaticProps: GetStaticProps = async () => ({
  props: {},
  revalidate: 1,
});

export default Home;

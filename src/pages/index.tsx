import { FC } from "react";
import { H1, P } from "src/components/Typography";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import parse from "html-react-parser";
import { useInView } from "react-intersection-observer";
import { SpiralsAbout } from "src/components/Spirals/SpiralsAbout.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";

const Home: FC = () => {
  const { inView, ref } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <Page ref={ref}>
        <Footer>
          <H1>Hi, {parse("I&apos;m")} Wade.</H1>
          <P>
            {parse("I&apos;m")} a senior software engineer for{" "}
            <a href="https://www.gotrhythm.com">Rhythm</a>, currently living in
            Washington, D.C. For fun, I{" "}
            <a href="https://instagram.com/nthoftype">build keyboards/cables</a>
            ,{" "}
            <a href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
              collect/play records
            </a>
            , and ocassionally{" "}
            <a href="https://twitch.tv/nthoftype">play video games</a>.{" "}
            {parse("Here&apos;s")} my <a href="mailto:w@dehammes.com">email</a>,
            my <a href="https://github.com/wadehammes">code</a>, and my{" "}
            <a href="https://twitter.com/nthoftype">twitter</a>.
          </P>
          <SpiralsAbout />
        </Footer>
      </Page>
      <SpiralsSVG visible={inView} />
    </>
  );
};

export default Home;

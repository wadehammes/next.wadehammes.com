import { FC } from "react";
import dynamic from "next/dynamic";
import { A, H1, P } from "src/components/Typography";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import parse from "html-react-parser";
import { Animate } from "src/components/Animate/Animate.component";
import { useInView } from "react-intersection-observer";

const SpiralsAbout = dynamic(() =>
  import("src/components/Spirals/SpiralsAbout.component"),
);

const SpiralsSVG = dynamic(() =>
  import("src/components/Spirals/SpiralsSVG.component"),
);

const Home: FC = () => {
  const { inView, ref } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <Page ref={ref}>
        <Footer>
          <Animate visible={inView}>
            <H1>Hi, {parse("I&apos;m")} Wade.</H1>
            <P>
              {parse("I&apos;m")} a senior software engineer for{" "}
              <A href="https://www.gotrhythm.com">Rhythm</A>, currently living
              in Washington, D.C. For fun, I{" "}
              <A href="https://instagram.com/nthoftype">
                build keyboards/cables
              </A>
              ,{" "}
              <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
                collect/play records
              </A>
              , and ocassionally{" "}
              <A href="https://twitch.tv/nthoftype">play video games</A>.{" "}
              {parse("Here&apos;s")} my{" "}
              <A href="mailto:w@dehammes.com">email</A>, my{" "}
              <A href="https://github.com/wadehammes">code</A>, and my{" "}
              <A href="https://twitter.com/nthoftype">twitter</A>.
            </P>
            <SpiralsAbout />
          </Animate>
        </Footer>
      </Page>
      <SpiralsSVG visible={inView} />
    </>
  );
};

export default Home;

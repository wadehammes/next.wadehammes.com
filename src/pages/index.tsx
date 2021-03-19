import { FC } from "react";
import { A, H1, P } from "src/components/Typography";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import { SpiralsAbout } from "src/components/Spirals/SpiralsAbout.component";
import { SpiralsSVG } from "src/components/Spirals/SpiralsSVG.component";
import parse from "html-react-parser";
import { Animate } from "src/components/Animate/Animate.component";
import { useInView } from "react-intersection-observer";

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
              in Washington, D.C. proper. Check out my{" "}
              <A href="https://github.com/wadehammes">code</A> on Github. For
              fun, I{" "}
              <A href="https://instagram.com/nthoftype">
                build keyboards/cables
              </A>{" "}
              and{" "}
              <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
                collect/play records
              </A>
              . To contact me, send an <A href="mailto:w@dehammes.com">email</A>{" "}
              or a <A href="https://twitter.com/nthoftype">tweet</A>.
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

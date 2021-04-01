import { FC } from "react";
import dynamic from "next/dynamic";
import { A, H1, P } from "src/components/Typography";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import parse from "html-react-parser";
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
          <H1>Hi, {parse("I&apos;m")} Wade.</H1>
          <P>
            {parse("I&apos;m")} a senior software engineer for{" "}
            <A href="https://www.gotrhythm.com">Rhythm</A>, currently living in
            Washington, D.C. proper. Check out my{" "}
            <A href="https://github.com/wadehammes">code</A> on Github. For fun,
            I{" "}
            <A href="https://instagram.com/nthoftype">build keyboards/cables</A>{" "}
            and{" "}
            <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
              collect/play records
            </A>
            . To contact me, send an <A href="mailto:w@dehammes.com">email</A>{" "}
            or a <A href="https://twitter.com/nthoftype">tweet</A>.
          </P>
          <SpiralsAbout />
        </Footer>
      </Page>
      <SpiralsSVG visible={inView} />
    </>
  );
};

export default Home;

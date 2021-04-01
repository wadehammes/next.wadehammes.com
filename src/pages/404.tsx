import { FC } from "react";
import dynamic from "next/dynamic";
import { A, H1, P } from "src/components/Typography";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import Link from "next/link";
import parse from "html-react-parser";
import { useInView } from "react-intersection-observer";

const SpiralsAbout = dynamic(() =>
  import("src/components/Spirals/SpiralsAbout.component"),
);

const SpiralsSVG = dynamic(() =>
  import("src/components/Spirals/SpiralsSVG.component"),
);

const E404: FC = () => {
  const { inView, ref } = useInView({
    triggerOnce: true,
  });

  return (
    <>
      <Page ref={ref}>
        <Footer>
          <H1>Error: 404</H1>
          <P>
            Whoops, {parse("you&apos;ve")} landed on a page that{" "}
            {parse("doesn&apos;t")} exist. No worries. Just head{" "}
            <Link href="/">
              <A>home</A>
            </Link>
            .
          </P>
          <SpiralsAbout />
        </Footer>
      </Page>
      <SpiralsSVG visible={inView} />
    </>
  );
};

export default E404;

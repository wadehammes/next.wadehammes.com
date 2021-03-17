import { FC, useEffect, useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { SPIRALS_VIEWBOX } from "src/utils/constants";
import { randomIntFromInterval, saveSvg } from "src/utils/helpers";
import { Button, ButtonVariants } from "src/components/Button/Button.component";
import { device } from "src/styles/theme";
import { A } from "src/components/Typography";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { useRouter } from "next/dist/client/router";

const Container = styled.div`
  padding: ${({ theme }) => theme.sizing.desktopPadding};
  position: relative;

  > svg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
    height: 100%;
    width: 100%;
    height: 100vh;
    width: 100vw;
    opacity: 0.5;
    transition: opacity 0.25s ease-in-out;

    @media ${device.tablet} {
      opacity: 1;
    }
  }
`;

const Footer = styled.footer`
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  padding: ${({ theme }) => theme.sizing.mobilePadding};

  @media ${device.tablet} {
    padding: ${({ theme }) => theme.sizing.desktopPadding};
  }

  p {
    max-width: 100%;

    @media ${device.tablet} {
      max-width: 72ch;
    }
  }

  .refresh {
    display: none;

    @media ${device.tablet} {
      display: flex;
    }
  }
`;

const Home: FC = () => {
  const [pageUrl, setPageUrl] = useState<Location | null>(null);
  const { replace } = useRouter();

  useEffect(() => {
    // Need to capture window.location in useEffect since this is in SSR
    // Used for hreflang meta tag
    setPageUrl(window.location);
  }, []);

  return (
    <>
      <Head>
        <title>Wade Hammes | Home</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.86, maximum-scale=1.0, user-scalable=0"
        />
        <meta
          name="description"
          content="Wade Hammes is a senior software engineer based in Washington, D.C., currently working for Rhythm."
        />
        <meta
          property="og:description"
          content="Wade Hammes is a senior software engineer based in Washington, D.C., currently working for Rhythm."
        />
        <meta property="og:image" content="/images/fractal.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@nthoftype" />
        <meta name="twitter:creator" content="@nthoftype" />
        <meta property="og:locale" content="en-US" />
        {pageUrl && (
          <>
            <meta
              property="og:url"
              content={`${pageUrl.origin}${pageUrl.pathname}`}
            />
            <link
              rel="canonical"
              href={`${pageUrl.origin}${pageUrl.pathname}`}
            />
          </>
        )}
      </Head>
      <Container>
        <svg
          className="fractal"
          viewBox={`0 0 ${SPIRALS_VIEWBOX} ${SPIRALS_VIEWBOX}`}
        >
          <Spirals />
          <Spirals strokeWidth={0.5} fill={false} />
          <Spirals rad={2} />
          <Spirals rad={2} circleOffset={200} />
          <Spirals strokeWidth={randomIntFromInterval(1, 8)} fill={false} />
          <Spirals />
        </svg>
        <Footer>
          <p>
            Hi, I'm <strong>Wade Hammes</strong>, a senior software engineer for{" "}
            <A href="https://www.gotrhythm.com">Rhythm</A>. Currently, I live in
            Washington, D.C. Previously, I worked for{" "}
            <A href="https://skyword.com">Skyword</A>, TrackMaven, and Pappas
            Group. For fun, I{" "}
            <A href="https://instagram.com/nthoftype">build keyboards/cables</A>{" "}
            and{" "}
            <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
              collect/play records
            </A>
            . Check out my <A href="https://github.com/wadehammes">code</A> on
            Github. To contact me, send an{" "}
            <A href="mailto:w@dehammes.com">email</A> or{" "}
            <A href="https://twitter.com/nthoftype">tweet</A>, or add me on{" "}
            <A href="https://www.linkedin.com/in/wadehammes">LinkedIn</A>.
          </p>
          <ButtonGroup>
            <Button
              variant={ButtonVariants.Primary}
              handleClick={() => saveSvg(".fractal", "background.svg")}
            >
              <DownloadIcon />
              Download SVG
            </Button>
            <Button
              variant={ButtonVariants.Text}
              handleClick={() => replace(window.location.href)}
              className="refresh"
            >
              Refresh SVG
            </Button>
          </ButtonGroup>
        </Footer>
      </Container>
    </>
  );
};

export default Home;

import { FC } from "react";
import Head from "next/head";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { SPIRALS_VIEWBOX } from "src/utils/constants";
import { randomIntFromInterval, saveSvg } from "src/utils/helpers";
import { Button } from "src/components/Button/Button.component";
import { device } from "src/styles/theme";
import { A } from "src/components/Typography";
import { DownloadIcon } from "src/styles/icons/download.icon";

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
      max-width: 80vw;
    }

    @media ${device.laptop} {
      max-width: 45vw;
    }
  }
`;

const Home: FC = () => (
  <>
    <Head>
      <title>W A D E H A M M E S</title>
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
          Hi, I'm <strong>Wade Hammes</strong>, a software engineer for{" "}
          <A href="https://www.gotrhythm.com">Rhythm</A>. Currently, I live in
          Washington, D.C. Previously, I worked for{" "}
          <A href="https://skyword.com">Skyword</A>, TrackMaven, and Pappas
          Group. On the side, I{" "}
          <A href="https://instagram.com/nthoftype">build keyboards</A> and{" "}
          <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
            collect/play records
          </A>
          . Check out my <A href="https://github.com/wadehammes">code</A> and{" "}
          <A href="mailto:w@dehammes.com">email me</A> to get in touch.
        </p>
        <p>
          <A href="#" onClick={() => window.location.reload()}>
            Refresh
          </A>{" "}
          to get a new randomly generated background SVG.
        </p>
        <p style={{ paddingTop: "0.5em" }}>
          <Button handleClick={() => saveSvg(".fractal", "background.svg")}>
            <DownloadIcon />
            Download SVG
          </Button>
        </p>
      </Footer>
    </Container>
  </>
);

export default Home;

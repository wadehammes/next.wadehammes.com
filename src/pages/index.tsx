import { FC } from "react";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { SPIRALS_VIEWBOX } from "src/utils/constants";
import { randomIntFromInterval, saveSvg } from "src/utils/helpers";
import { Button } from "src/components/Button/Button.component";
import { device } from "src/styles/theme";
import { A } from "src/components/Typography";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { useRouter } from "next/dist/client/router";
import { Page } from "src/components/Page/Page.component";
import { Footer } from "src/components/Layout";
import { ButtonVariants } from "src/components/Button/Button.interfaces";

const SVG = styled.svg`
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
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.sizing.desktopPadding};
  position: relative;
`;

const Home: FC = () => {
  const { replace } = useRouter();

  return (
    <>
      <Page>
        <Container>
          <Footer>
            <p>
              Hi, I'm <strong>Wade Hammes</strong>, a senior software engineer
              for <A href="https://www.gotrhythm.com">Rhythm</A>. Currently, I
              live in Washington, D.C. Previously, I worked for{" "}
              <A href="https://skyword.com">Skyword</A>, TrackMaven, and Pappas
              Group. For fun, I{" "}
              <A href="https://instagram.com/nthoftype">
                build keyboards/cables
              </A>{" "}
              and{" "}
              <A href="https://www.youtube.com/watch?v=YqXR8nlEaKE">
                collect/play records
              </A>
              . Check out my <A href="https://github.com/wadehammes">code</A> on
              Github. To contact me, send an{" "}
              <A href="mailto:w@dehammes.com">email</A>,{" "}
              <A href="https://twitter.com/nthoftype">tweet</A>.
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
      </Page>
      <SVG
        className="fractal"
        viewBox={`0 0 ${SPIRALS_VIEWBOX} ${SPIRALS_VIEWBOX}`}
      >
        <Spirals />
        <Spirals strokeWidth={0.5} fill={false} />
        <Spirals rad={2} />
        <Spirals rad={2} circleOffset={200} />
        <Spirals strokeWidth={randomIntFromInterval(1, 8)} fill={false} />
        <Spirals />
      </SVG>
    </>
  );
};

export default Home;

import { FC } from "react";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { SPIRALS_CONSTANTS as constant } from "src/components/Spirals/Spirals.constants";
import { randomIntFromInterval, saveSvg } from "src/utils/helpers";
import { Button } from "src/components/Button/Button.component";
import { A } from "src/components/Typography";
import { DownloadIcon } from "src/styles/icons/download.icon";
import { ButtonGroup } from "src/components/Button/ButtonGroup.component";
import { useRouter } from "next/dist/client/router";
import { Page } from "src/components/Page/Page.component";
import { Container, Footer } from "src/components/Layout";
import { ButtonVariants } from "src/components/Button/Button.interfaces";
import { SVG } from "src/components/SVG/SVG.component";

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
              <A href="mailto:w@dehammes.com">email</A> or a{" "}
              <A href="https://twitter.com/nthoftype">tweet</A>.
            </p>
            <p>
              The background SVG is randomly generated with vanilla Javascript
              and animated with <A href="https://greensock.com/gsap/">GSAP</A>.
              No two will ever be the same.
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
        viewBox={`0 0 ${constant.VIEWBOX} ${constant.VIEWBOX}`}
      >
        <Spirals />
        <Spirals strokeWidth={0.5} fill={false} />
        <Spirals rad={2} />
        <Spirals rad={2} circleOffset={200} />
        <Spirals
          circleOffset={5}
          fill={false}
          strokeWidth={randomIntFromInterval(3, 6)}
        />
        <Spirals strokeWidth={randomIntFromInterval(1, 8)} fill={false} />
        <Spirals />
      </SVG>
    </>
  );
};

export default Home;

import { FC, useCallback, useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";
import { SPIRALS_VIEWBOX } from "src/utils/constants";
import { randomIntFromInterval } from "src/utils/helpers";

const Container = styled.div`
  padding: 4em;
  position: relative;

  svg {
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

const Button = styled.button`
  position: relative;
  z-index: 1;
`;

const Home: FC = () => (
  <>
    <Head>
      <title>W A D E H A M M E S</title>
    </Head>
    <Container>
      <svg viewBox={`0 0 ${SPIRALS_VIEWBOX} ${SPIRALS_VIEWBOX}`}>
        <Spirals />
        <Spirals strokeWidth={0.25} fill={false} />
        <Spirals rad={2} />
        <Spirals strokeWidth={2} fill={false} rad={5} />
        <Spirals />
      </svg>
    </Container>
  </>
);

export default Home;

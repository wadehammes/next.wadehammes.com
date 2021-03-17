import { FC } from "react";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";
import Head from "next/head";

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

const Home: FC = () => {
  return (
    <>
      <Head>
        <title>W A D E H A M M E S</title>
      </Head>
      <Container>
        <Spirals />
        <Spirals strokeWidth={0.5} fill={false} h={150} />
        <Spirals strokeWidth={2} fill={false} />
      </Container>
    </>
  );
};

export default Home;

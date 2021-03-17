import { FC } from "react";
import styled from "styled-components";
import { Spirals } from "src/components/Spirals/Spirals.component";

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
  }
`;

const Home: FC = () => {
  return (
    <Container>
      <Spirals />
      <Spirals strokeWidth={0.5} fill={false} h={150} />
    </Container>
  );
};

export default Home;

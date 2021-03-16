import { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const Container = styled.div`
  display: block;
  max-width: 50%;
`;

const Home: FC = () => {
  const router = useRouter();

  return <Container>Hello, {router.asPath}</Container>;
};

export default Home;

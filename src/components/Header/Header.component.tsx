import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";

const Container = styled.nav`
  position: relative;
  padding: 2em;
  z-index: 9999;

  @media screen and (min-width: 60em) {
    padding: 4em;
  }
`;

const Logo = styled.div`
  width: 2.5em;

  @media screen and (min-width: 60em) {
    width: 5em;
  }
`;

export const Header = () => {
  return (
    <Container>
      <Logo>
        <Link href="/" passHref>
          <a>
            <Crown />
          </a>
        </Link>
      </Logo>
    </Container>
  );
};

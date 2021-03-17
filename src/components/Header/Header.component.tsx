import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";

const Container = styled.nav`
  position: relative;
  padding: 4em;
  z-index: 9999;
`;

const Logo = styled.div`
  width: 5em;
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

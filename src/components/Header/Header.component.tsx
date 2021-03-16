import styled from "styled-components";
import { Crown } from "src/styles/icons/crown";
import Link from "next/link";

const Container = styled.nav`
  padding: 0 0 2em 0;
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

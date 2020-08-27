import styled from 'styled-components';
import Crown from 'styles/icons/crown';
import Link from 'next/link';

const Container = styled.nav`
  padding: 0 0 2em 0;
`;

const Logo = styled.div`
  width: 5em;
`;

const Header = () => {
  return (
    <Container>
      <Logo>
        <Link href="/">
          <a>
            <Crown />
          </a>
        </Link>
      </Logo>
    </Container>
  );
};

export default Header;

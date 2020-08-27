import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Container = styled.ul`
  list-style: none;
  padding: 0 0 2em 0;

  li {
    display: inline-flex;
  }
`;

const Divider = styled.span`
  display: inline-block;
  padding: 0 1em;

  &:after {
    content: '${(props: DividerProps) => props.arrow}';
  }
`;

const BreadCrumbs = ({entry}) => {
  let parentHref = null;
  let parentName = null;

  switch (entry) {
    case 'workEntry':
      parentHref = '/work';
      parentName = 'Work';
      break;
    default:
      parentHref = null;
      parentName = null;
  }

  return (
    <Container>
      <li>
        <Link href="/">
          <a>Mi Casa</a>
        </Link>
      </li>
      {parentHref && parentName && (
        <li>
          <Divider arrow="↦" />
          <Link href={parentHref}>
            <a>{parentName}</a>
          </Link>
          <Divider arrow="↴" />
        </li>
      )}
    </Container>
  );
};

type DividerProps = {
  arrow: string,
};

Divider.propTypes = {
  arrow: PropTypes.string,
};

export default BreadCrumbs;

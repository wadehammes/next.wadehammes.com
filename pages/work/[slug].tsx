import {useEffect, useState, FunctionComponent} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import styled from 'styled-components';
import parse from 'html-react-parser';

const Content = styled.div`
  display: block;
  padding: 2em;
  max-width: 50%;
`;

const Work: FunctionComponent = () => {
  const router = useRouter();
  const [work, setWork] = useState(null);
  const {slug} = router.query;

  useEffect(() => {
    if (slug) {
      (async () => {})();
    }
  }, [slug]);

  return <p>Work coming soon!</p>;
};

export default Work;

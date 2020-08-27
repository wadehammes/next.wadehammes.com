import {useEffect, useState, FunctionComponent} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import parse from 'html-react-parser';
import {client} from 'client/index';
import {normalizedWorkEntry, WorkEntry} from 'helpers/index';

const Container = styled.div`
  display: block;
  max-width: 50%;
`;

const H2 = styled.h2`
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 0.25em;
`;

const Work: FunctionComponent = () => {
  const router = useRouter();
  const [work, setWork] = useState(null);

  useEffect(() => {
    (async () => {
      client
        .getEntries({
          content_type: 'workEntry',
        })
        .then(function (entries: any) {
          setWork(entries.items.map(normalizedWorkEntry));
        })
        .catch((error) => {
          console.log(`${error}`);
          router.push('/');
        });
    })();
  }, []);

  console.log(work);

  return (
    <>
      {work &&
        work.map((work: WorkEntry) => (
          <Container key={work.fields.slug}>
            <Link href="/work/[slug]" as={`/work/${work.fields.slug}`}>
              <a>
                <H2>{work.fields.displayTitle}</H2>
              </a>
            </Link>

            <p>{new Date(work.fields.dateCompleted).toLocaleString()}</p>
            {work.fields.excerpt && <p>{parse(work.fields.excerpt)}</p>}
          </Container>
        ))}
    </>
  );
};

export default Work;

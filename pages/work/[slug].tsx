import {useEffect, useState, FunctionComponent} from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import parse from 'html-react-parser';
import {client} from 'client/index';
import {documentToHtmlString} from '@contentful/rich-text-html-renderer';
import {normalizedWorkEntry, Entries} from 'helpers/index';
import Breadcrumbs from 'components/breadcrumbs';
import Slider from 'react-slick';

const Container = styled.article`
  display: block;
`;

const H1 = styled.h1`
  font-size: 4em;
  font-weight: bold;
  margin-bottom: 0.25em;
  max-width: 50rem;
`;

const Copy = styled.section`
  padding: 2em 0;
  max-width: 66ch;
`;

const Picture = styled.picture`
  display: block;
  padding: 0 0 2.5em 0;
  width: 100%;
`;

const SliderWrapper = styled.div`
  display: block;
  width: 100%;
`;

const Work: FunctionComponent = () => {
  const router = useRouter();
  const [work, setWork] = useState(null);
  const {slug} = router.query;

  useEffect(() => {
    if (slug) {
      (async () => {
        client
          .getEntries({
            content_type: 'workEntry',
            'fields.slug': slug,
          })
          .then((entries: any) => {
            console.log(entries);
            setWork(normalizedWorkEntry(entries.items[0]));
          })
          .catch((error) => {
            console.log(`${error}`);
            router.push('/work');
          });
      })();
    }
  }, [slug]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <>
      {work && (
        <Container>
          <Breadcrumbs entry={work.sys.contentType.sys.id} />
          <header>
            {work.fields.hero && (
              <Picture>
                <source srcSet={`${work.fields.hero.fields.file.url}?w=1440`} media="(min-width: 800px)" />
                <source srcSet={`${work.fields.hero.fields.file.url}?w=800`} media="(min-width: 400px)" />
                <source srcSet={`${work.fields.hero.fields.file.url}?w=200`} media="(min-width: 100px)" />
                <img loading="lazy" src={`${work.fields.hero.fields.file.url}?w=1440`} alt={work.fields.displayTitle} />
              </Picture>
            )}
            <H1>{work.fields.displayTitle}</H1>
            <p>
              {new Date(work.fields.dateCompleted).toLocaleString()} &bull;{' '}
              <a href={work.fields.siteUrl} target="_blank">
                Visit Site
              </a>
            </p>
          </header>
          <Copy>{parse(documentToHtmlString(work.fields.copy))}</Copy>
          {Boolean(work.fields.gallery && work.fields.gallery.length) && (
            <SliderWrapper>
              {work.fields.gallery.map((image) => (
                <Picture key={image.fields.file.url}>
                  <source srcSet={`${image.fields.file.url}?w=1440`} media="(min-width: 800px)" />
                  <source srcSet={`${image.fields.file.url}?w=800`} media="(min-width: 400px)" />
                  <source srcSet={`${image.fields.file.url}?w=200`} media="(min-width: 100px)" />
                  <img loading="lazy" src={`${image.fields.file.url}?w=1440`} alt={image.fields.title} />
                </Picture>
              ))}
            </SliderWrapper>
          )}
        </Container>
      )}
    </>
  );
};

export default Work;

import type { Metadata } from "next";
import { LinksPage } from "src/components/Links/LinksPage.component";
import {
  SITE_CREATOR,
  SITE_EMAIL,
  SITE_TITLE,
  SITE_URL,
} from "src/constants/site";
import { buildGravatarUrl } from "src/helpers/gravatar";
import { getCachedLinksPage } from "src/prismic/getLinksPage";

export const revalidate = 604800;

const LINKS_TITLE = `Links · ${SITE_TITLE}`;
const LINKS_DESCRIPTION =
  "Links to projects, mixes, and profiles for Wade Hammes.";

export const generateMetadata = async (): Promise<Metadata> => {
  const linksPage = await getCachedLinksPage();

  const title = linksPage?.metaTitle ?? LINKS_TITLE;
  const description = linksPage?.metaDescription ?? LINKS_DESCRIPTION;
  const metaImage = linksPage?.metaImage;

  return {
    title,
    description,
    metadataBase: SITE_URL,
    creator: SITE_CREATOR,
    publisher: SITE_CREATOR,
    alternates: {
      canonical: "/links",
    },
    openGraph: {
      title,
      description,
      url: new URL("/links", SITE_URL),
      siteName: SITE_TITLE,
      type: "website",
      locale: "en_US",
      ...(metaImage
        ? {
            images: [
              {
                url: metaImage.url,
                width: metaImage.width,
                height: metaImage.height,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: metaImage ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
};

const Links = async () => {
  const linksPage = await getCachedLinksPage();

  return (
    <LinksPage
      fallbackAvatarUrl={buildGravatarUrl(SITE_EMAIL)}
      linksPage={linksPage}
    />
  );
};

export default Links;

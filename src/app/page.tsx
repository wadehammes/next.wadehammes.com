import type { Metadata } from "next";
import { HomePage } from "src/components/HomePage/HomePage.component";
import {
  SITE_CREATOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "src/constants/site";
import { getCachedHomePage } from "src/prismic/getPage";

export const revalidate = 604800;

export const generateMetadata = async (): Promise<Metadata> => {
  const homePage = await getCachedHomePage();

  const title = homePage?.metaTitle ?? SITE_TITLE;
  const description = homePage?.metaDescription ?? SITE_DESCRIPTION;
  const metaImage = homePage?.metaImage;

  return {
    title,
    description,
    metadataBase: SITE_URL,
    creator: SITE_CREATOR,
    publisher: SITE_CREATOR,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
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

const Home = async () => {
  const homePage = await getCachedHomePage();

  return <HomePage homePage={homePage} />;
};

export default Home;

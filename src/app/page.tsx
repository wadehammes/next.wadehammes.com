import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePage } from "src/components/HomePage/HomePage.component";
import {
  SITE_CREATOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "src/constants/site";
import { getCachedHomePage, getPublishedHomePage } from "src/prismic/getPage";

export async function generateMetadata(): Promise<Metadata> {
  "use cache";
  const homePage = await getPublishedHomePage();

  const title = homePage?.metaTitle ?? SITE_TITLE;
  const description = homePage?.metaDescription ?? SITE_DESCRIPTION;
  const metaImage = homePage?.metaImage;

  return {
    title,
    description,
    metadataBase: SITE_URL.href,
    creator: SITE_CREATOR,
    publisher: SITE_CREATOR,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL.href,
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
}

async function HomePageContent() {
  const homePage = await getCachedHomePage();

  return <HomePage homePage={homePage} />;
}

const Home = () => {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
};

export default Home;

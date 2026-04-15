import type { Metadata } from "next";
import { HomePage } from "src/components/HomePage/HomePage.component";
import { getCachedHomePage } from "src/prismic/getPage";

/** ISR (seconds); keep in sync with `PRISMIC_DEFAULT_REVALIDATE_SECONDS` in `src/prismic/constants.ts`. */
export const revalidate = 604800; // 7 days

const SITE_TITLE = "Wade Hammes";
const SITE_DESCRIPTION =
  "Wade Hammes is a senior software engineer for Rhythm Energy, helping build the best customer experience in retail renewable energy, and a co-founder of Provisioner, a full-service creative agency helping grow brands. He is also a pretty fun guy.";

const SITE_URL = new URL("https://wadehammes.com/");

export const generateMetadata = async (): Promise<Metadata> => {
  const homePage = await getCachedHomePage();

  const title = homePage?.metaTitle ?? SITE_TITLE;
  const description = homePage?.metaDescription ?? SITE_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: SITE_URL,
    creator: "Wade Hammes",
    publisher: "Wade Hammes",
  };
};

const Home = async () => {
  const homePage = await getCachedHomePage();

  return <HomePage homePage={homePage} />;
};

export default Home;

import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_TITLE } from "src/constants/site";
import { getCachedHomePage } from "src/prismic/getPage";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const homePage = await getCachedHomePage();
  const name = homePage?.metaTitle ?? SITE_TITLE;
  const description = homePage?.metaDescription ?? SITE_DESCRIPTION;

  return {
    name,
    short_name: SITE_TITLE,
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#171717",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

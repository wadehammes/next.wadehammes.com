import type { MetadataRoute } from "next";
import { SITE_URL } from "src/constants/site";
import { getPublishedLinksPage } from "src/prismic/getLinksPage";
import { getPublishedHomePage } from "src/prismic/getPage";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homePage, linksPage] = await Promise.all([
    getPublishedHomePage(),
    getPublishedLinksPage(),
  ]);

  const homeLastModified = homePage?.lastPublicationDate
    ? new Date(homePage.lastPublicationDate)
    : new Date();
  const linksLastModified = linksPage?.lastPublicationDate
    ? new Date(linksPage.lastPublicationDate)
    : new Date();

  return [
    {
      url: SITE_URL.href,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/links", SITE_URL).href,
      lastModified: linksLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}

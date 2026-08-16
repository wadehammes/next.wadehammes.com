import "server-only";
import { cacheLife, cacheTag } from "next/cache";

export const applyPrismicCacheLife = (): void => {
  cacheLife("weeks");
};

export const applyPrismicHomeCacheLife = (): void => {
  applyPrismicCacheLife();
  cacheTag("prismic-home");
};

export const applyPrismicLinksCacheLife = (): void => {
  applyPrismicCacheLife();
  cacheTag("prismic-links");
};

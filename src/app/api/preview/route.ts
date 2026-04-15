import type { LinkResolverFunction, PrismicDocument } from "@prismicio/client";
import { redirectToPreviewURL } from "@prismicio/next";
import type { NextRequest } from "next/server";
import { getPrismicClient } from "src/prismic/client";

/**
 * Starts Prismic Preview / Draft Mode. In Prismic → Settings → Previews, set the preview URL to
 * `https://<your-domain>/api/preview` (no query string). “View preview” then hits e.g.
 * `/api/preview?token=<encoded-preview-api-url>&documentId=<id>` — handled by `redirectToPreviewURL`.
 *
 * `LinkResolverFunction` is typed for link fields; `resolvePreviewURL` passes a document at runtime.
 */
const linkResolver: LinkResolverFunction = (doc) => {
  const page = doc as unknown as PrismicDocument;

  if (page.type === "home") {
    return "/";
  }
  return "/";
};

export async function GET(request: NextRequest) {
  const client = getPrismicClient();

  return await redirectToPreviewURL({
    client,
    request,
    linkResolver,
    defaultURL: "/",
  });
}

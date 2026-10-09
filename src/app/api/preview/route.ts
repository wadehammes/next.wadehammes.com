import type { LinkResolverFunction, PrismicDocument } from "@prismicio/client";
import { redirectToPreviewURL } from "@prismicio/next";
import { type NextRequest, NextResponse } from "next/server";
import { getPrismicClient } from "src/prismic/client";
import { isPrismicConfigured } from "src/prismic/constants";

const linkResolver: LinkResolverFunction = (doc) => {
  const page = doc as unknown as PrismicDocument;

  if (page.type === "home") {
    return "/";
  }

  if (page.type === "links") {
    return "/links";
  }

  return "/";
};

export async function GET(request: NextRequest) {
  if (!isPrismicConfigured()) {
    return NextResponse.json(
      { message: "Prismic is not configured." },
      { status: 503 },
    );
  }

  const client = getPrismicClient();

  return await redirectToPreviewURL({
    client,
    request,
    linkResolver,
    defaultURL: "/",
  });
}

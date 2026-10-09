import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { cacheTagsForPrismicWebhook } from "src/prismic/revalidateFromWebhook";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.PRISMIC_REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "PRISMIC_REVALIDATE_SECRET is not set" },
      { status: 503 },
    );
  }

  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-prismic-webhook-secret");

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 },
    );
  }

  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const tags = cacheTagsForPrismicWebhook(payload);

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: true, tags });
}

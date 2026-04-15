import { GoogleAnalytics } from "@next/third-parties/google";
import { PrismicPreview } from "@prismicio/next";
import { Space_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { PreviewModeOverlay } from "src/components/PreviewModeOverlay/PreviewModeOverlay.component";
import { SpiralsProvider } from "src/contexts/SpiralsContext";
import { getPrismicRepositoryName } from "src/prismic/constants";

import "src/components/PreviewModeOverlay/preview-overlay.css";
import "src/styles/critical.css";
import "src/styles/global.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
  preload: true,
});

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const prismicRepo = getPrismicRepositoryName();
  const isPreview = (await draftMode()).isEnabled;

  const body = (
    <>
      <SpiralsProvider>
        <main>{children}</main>
      </SpiralsProvider>
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_KEY as string} />
    </>
  );

  return (
    <html lang="en" className={spaceMono.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
      </head>
      <body>
        {isPreview ? <PreviewModeOverlay /> : null}
        {prismicRepo ? (
          <PrismicPreview repositoryName={prismicRepo}>{body}</PrismicPreview>
        ) : (
          body
        )}
      </body>
    </html>
  );
}

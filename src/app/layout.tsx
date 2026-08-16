import { GoogleAnalytics } from "@next/third-parties/google";
import { PrismicPreview } from "@prismicio/next";
import { Space_Mono } from "next/font/google";
import { Suspense } from "react";
import { PreviewModeOverlayGate } from "src/components/PreviewModeOverlay/PreviewModeOverlayGate.component";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prismicRepo = getPrismicRepositoryName();
  const gaId = process.env.GOOGLE_ANALYTICS_KEY;

  const body = (
    <>
      <SpiralsProvider>
        <main>{children}</main>
      </SpiralsProvider>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
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
        <Suspense fallback={null}>
          <PreviewModeOverlayGate />
        </Suspense>
        {prismicRepo ? (
          <PrismicPreview repositoryName={prismicRepo}>{body}</PrismicPreview>
        ) : (
          body
        )}
      </body>
    </html>
  );
}

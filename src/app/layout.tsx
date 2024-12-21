"use client";

import isValidProp from "@emotion/is-prop-valid";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Space_Mono } from "next/font/google";
import StyledComponentsRegistry from "src/lib/registry";
import { CSSRootVariables } from "src/styles/cssVariables";
import { GlobalStyles } from "src/styles/global";
import { StyleSheetManager } from "styled-components";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceMono.className}>
      <body>
        <StyledComponentsRegistry>
          <CSSRootVariables />
          <GlobalStyles />
          <StyleSheetManager shouldForwardProp={isValidProp}>
            {children}
          </StyleSheetManager>
        </StyledComponentsRegistry>
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_KEY as string} />
      </body>
    </html>
  );
}

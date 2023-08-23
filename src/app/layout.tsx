"use client";

import StyledComponentsRegistry from "src/lib/registry";
import { CSSRootVariables } from "src/styles/cssVariables";
import { GlobalStyles } from "src/styles/global";
import { StyleSheetManager } from "styled-components";
import isValidProp from "@emotion/is-prop-valid";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Wade Hammes</title>
        <link rel="icon" href="favicon.webp" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <CSSRootVariables />
          <GlobalStyles />
          <StyleSheetManager shouldForwardProp={isValidProp}>
            {children}
          </StyleSheetManager>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

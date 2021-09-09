import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "src/styles/global";
import { theme } from "src/styles/theme";
import Script from "next/script";

export default class WadeHammes extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-C9S06TQ2E4" />
        <Script id="gtag">
          {
            "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-C9S06TQ2E4');"
          }
        </Script>
      </>
    );
  }
}

import App from "next/app";
import React from "react";
import { GlobalStyles } from "src/styles/global";
import Script from "next/script";
import { CSSRootVariables } from "src/styles/cssVariables";

export default class WadeHammes extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <CSSRootVariables />
        <GlobalStyles />
        <Component {...pageProps} />
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

import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "src/styles/global";
import { theme } from "src/styles/theme";

export default class WadeHammes extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    );
  }
}

import App from "next/app";
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyles } from "src/styles/global";
import { theme } from "src/styles/theme";
import { Header } from "src/components/Header/Header.component";

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

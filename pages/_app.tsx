import App from 'next/app';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {GlobalStyles} from 'styles/global';
import {theme} from 'styles/theme';
import 'slick-carousel/slick/slick.css';

export default class WadeHammes extends App {
  render() {
    const {Component, pageProps} = this.props;
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

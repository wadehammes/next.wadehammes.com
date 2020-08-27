import App from 'next/app';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import {GlobalStyles} from 'styles/global';
import {theme} from 'styles/theme';
import Header from 'components/header';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';

const Container = styled.div`
  padding: 5em;

  &:before {
    content: '';
    display: block;
    position: fixed;
    background-color: ${theme.colors.gray};
    left: 5em;
    top: 0;
    width: 1px;
    height: 100vh;
    opacity: 0.15;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-areas:
    header header
    component component;
  grid-gap: 5em;
`;

export default class WadeHammes extends App {
  render() {
    const {Component, pageProps} = this.props;
    return (
      <Container>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
          <Grid>
            <Header />
            <Component {...pageProps} />
          </Grid>
        </ThemeProvider>
      </Container>
    );
  }
}

import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

// eslint-disable-next-line import/no-default-export
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="favicon.webp" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-C9S06TQ2E4"
          />
          <script
            // This is how NextJS says to include GA tags in their official documentation:
            // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html:
                "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-C9S06TQ2E4');",
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

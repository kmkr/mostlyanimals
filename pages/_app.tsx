import type { AppProps } from "next/app";
import Head from "next/head";

import "../src/css/app.css";
import "../src/polyfills";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="author" content="Kris-Mikael Krister" />
        <meta
          name="google-site-verification"
          content="GV2uFZR4en6znRvzODbQEjF4vuUK9J2kAmGw7BwAbnE"
        />
        <link rel="icon" href="/images/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          href="/images/logo_favicon.svg"
          sizes="any"
          type="image/svg+xml"
        />
      </Head>
      <Component {...pageProps} />
      <script
        async
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
    </>
  );
}

export default MyApp;

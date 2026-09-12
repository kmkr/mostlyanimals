import Head from "next/head";
import type { AppProps } from "next/app";

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
        <link
          rel="icon"
          type="image/png"
          href="/images/favicon-100.png"
          sizes="100x100"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/favicon-192.png"
          sizes="192x192"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/favicon-512.png"
          sizes="512x512"
        />
        <link rel="icon" href="/images/favicon.ico" sizes="32x32" />
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

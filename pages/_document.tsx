import { Head, Html, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/next";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Raleway:300,600"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

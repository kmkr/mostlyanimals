import Head from "next/head";
import type { ReactNode } from "react";

const MAHead = ({
  title,
  keywords,
  meta,
}: {
  title: string;
  keywords: string[];
  meta: Record<string, string | number | null>;
}): ReactNode => (
  <Head>
    <title>{title}</title>
    <meta name="keywords" content={keywords.join(", ")} />
    {Object.entries(meta).map(([key, value]) => (
      <meta key={key} property={key} content={value?.toString()} />
    ))}
  </Head>
);

export default MAHead;

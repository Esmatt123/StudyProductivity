// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        {/* Remove viewport meta and title from here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
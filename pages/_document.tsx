import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin={""}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <Head />
      <body data-color-mode="light">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import Document, { Html, Main, Head, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

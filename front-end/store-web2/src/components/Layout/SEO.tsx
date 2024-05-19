import Head from "next/head";

export default function SEO({
  title = "Trang chủ",
  description = "Learn cool stuff from a collection of awesome things.",
  ogImgUrl = "/og-image.png",
  ogUrl = "https://cuchoami.store",
}) {
  return (
    <>
      <Head>
        <title key="title">{`${title} - Cúc Hoạ Mi`}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        <meta key="og:image" property="og:image" content={ogImgUrl} />
        <meta key="og:url" property="og:url" content={ogUrl} />
        <meta
          key="twitter:card"
          property="twitter:card"
          content="summary_large_image"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
